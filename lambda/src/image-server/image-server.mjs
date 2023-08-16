import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ImageInfo } from '../resource/image-info.mjs';
import { SupportedType } from '../helper/supported-type.mjs';
import { InvalidStateError } from '../error/invalid-state-error.mjs';
import { FileNotFoundError } from '../error/file-not-found-error.mjs';

export class ImageServer {
    #s3;
    #config;
    #modifierFacade;
    #resourceFactory;
    #responseFactory;
    #signatureStrategy;
    #noImageResolver;

    constructor({ s3, config, modifierFacade, resourceFactory, responseFactory, signatureStrategy, noImageResolver }) {
        this.#s3 = s3;
        this.#config = config;
        this.#modifierFacade = modifierFacade;
        this.#resourceFactory = resourceFactory;
        this.#responseFactory = responseFactory;
        this.#signatureStrategy = signatureStrategy;
        this.#noImageResolver = noImageResolver;
    }

    async getImageResponse(request) {
        // strip base path
        let path = request.path;

        if ('/' === path[0]) {
            path = path.slice(1);
        }

        if (!!this.#config.BASE_PATH && path.startsWith(this.#config.BASE_PATH)) {
            path = path.slice(this.#config.BASE_PATH.length);

            if ('/' === path[0]) {
                path = path.slice(1);
            }
        }

        // validate signature token
        const signatureToken = request.hasQuery(this.#config.SIGNATURE_PARAMETER_NAME) ? request.getQuery(this.#config.SIGNATURE_PARAMETER_NAME) : null;

        this.#signatureStrategy.verifyToken(signatureToken, path);

        // parse image info & modifiers
        const parts = path.split('/');
        const pathCount = parts.length;

        if (2 > pathCount) {
            throw new InvalidStateError('Missing modifier in requested path.');
        }

        const modifierString = parts[pathCount - 2];
        parts.splice(pathCount - 2, 1);

        const info = new ImageInfo(parts.join('/'));

        if (request.hasQuery(this.#config.VERSION_PARAMETER_NAME)) {
            info.version = request.getQuery(this.#config.VERSION_PARAMETER_NAME);
        }

        if (null === info.extension) {
            throw new InvalidStateError('Missing file extension in requested path.');
        }

        const modifiers = this.#modifierFacade.codec.decode(modifierString);

        try {
            const resource = await this.#resourceFactory.create(info);

            await resource.modifyImage(modifiers);

            const buffer = await resource.image.toBuffer();
            const now = new Date();
            const command = new PutObjectCommand({
                Bucket: this.#config.CACHE_BUCKET,
                Body: buffer,
                ContentType: SupportedType.getTypeByExtension(resource.info.extension),
                Key: this.#createCachedPath(resource.info, modifierString),
                ACL: 'private',
                CacheControl: `public, max-age=${this.#config.CACHE_MAX_AGE.toString()}`,
                Expires: new Date(now.getTime() + (this.#config.CACHE_MAX_AGE * 1000)),
            });

            try {
                await this.#s3.send(command);

                return this.#responseFactory.createRedirectResponse(this.#createLink(resource.info, modifierString, signatureToken));
            } catch (e) {
                throw new InvalidStateError(e.message);
            }
        } catch (e) {
            if (e instanceof FileNotFoundError) {
                const noImageResponse = this.#getNoImageResponse(info, modifierString);

                if (null !== noImageResponse) {
                    return noImageResponse;
                }
            }

            throw e;
        }
    }

    #createCachedPath(info, modifierString) {
        const basePath = this.#config.BASE_PATH.length ? (this.#config.BASE_PATH + '/') : '';

        return `${basePath}${info.createCachedPath(modifierString)}`;
    }

    #getHostUrl() {
        return new URL(
            null !== this.#config.HOST ? this.#config.HOST : `https://${this.#config.CACHE_BUCKET}.s3.${this.#s3.config.region}.amazonaws.com`,
        );
    }

    #createLink(info, modifierString, signatureToken = null) {
        const url = this.#getHostUrl();
        url.pathname = this.#createCachedPath(info, modifierString);

        if (null !== signatureToken) {
            url.searchParams.set(this.#config.SIGNATURE_PARAMETER_NAME, signatureToken);
        }

        if (null !== info.version) {
            url.searchParams.set(this.#config.SIGNATURE_PARAMETER_NAME, info.version);
        }

        return url.toString();
    }

    #createNoImageLink(info, modifierString) {
        const url = this.#getHostUrl();
        const path = this.#createCachedPath(info, modifierString);
        const signatureToken = this.#signatureStrategy.createToken(path);

        url.pathname = path;

        if (null !== signatureToken) {
            url.searchParams.set(this.#config.SIGNATURE_PARAMETER_NAME, signatureToken);
        }

        return url.toString();
    }

    #getNoImageResponse(info, modifierString) {
        try {
            const noImageInfo = this.#noImageResolver.resolveNoImage(info.toString());

            noImageInfo.extension = info.extension;

            return this.#responseFactory.createRedirectResponse(
                this.#createNoImageLink(noImageInfo, modifierString),
            );
        } catch (e) {
            return null;
        }
    }
}
