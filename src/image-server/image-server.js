'use strict';

const ImageInfo = require('../resource/image-info');
const SupportedType = require('../helper/supported-type');

const InvalidStateError = require('../error/invalid-state-error');
const FileNotFoundError = require('../error/file-not-found-error');

class ImageServer {
    constructor(s3, config, modifierFacade, resourceFactory, responseFactory, signatureStrategy, noImageResolver) {
        this._s3 = s3;
        this._config = config;
        this._modifierFacade = modifierFacade;
        this._resourceFactory = resourceFactory;
        this._responseFactory = responseFactory;
        this._signatureStrategy = signatureStrategy;
        this._noImageResolver = noImageResolver;
    }

    async getImageResponse(request) {
        // strip base path
        let path = request.path;

        if ('/' === path[0]) {
            path = path.substr(1);
        }

        if (!!this._config.BASE_PATH && path.startsWith(this._config.BASE_PATH)) {
            path = path.substr(this._config.BASE_PATH.length);

            if ('/' === path[0]) {
                path = path.substr(1);
            }
        }

        // validate signature token
        const signatureToken = request.hasQuery(this._config.SIGNATURE_PARAMETER_NAME) ? request.getQuery(this._config.SIGNATURE_PARAMETER_NAME) : null;

        this._signatureStrategy.verifyToken(signatureToken, path);

        // parse image info & modifiers
        const parts = path.split('/');
        const pathCount = parts.length;

        if (2 > pathCount) {
            throw new InvalidStateError('Missing modifier in requested path.');
        }

        const modifierString = parts[pathCount - 2];
        parts.splice(pathCount - 2, 1);

        const info = new ImageInfo(parts.join('/'));

        if (request.hasQuery(this._config.VERSION_PARAMETER_NAME)) {
            info.version = request.getQuery(this._config.VERSION_PARAMETER_NAME);
        }

        if (null === info.extension) {
            throw new InvalidStateError('Missing file extension in requested path.');
        }

        const modifiers = this._modifierFacade.codec.decode(modifierString);

        try {
            const resource = await this._resourceFactory.create(info);

            await resource.modifyImage(modifiers);

            const buffer = await resource.image.toBuffer();
            const now = new Date();

            return await this._s3.putObject({
                Bucket: this._config.CACHE_BUCKET,
                Body: buffer,
                ContentType: SupportedType.getTypeByExtension(resource.info.extension),
                Key: this._createCachedPath(resource.info, modifierString),
                ACL: 'private',
                CacheControl: `public, max-age=${this._config.CACHE_MAX_AGE.toString()}`,
                Expires: new Date(now.getTime() + (this._config.CACHE_MAX_AGE * 1000))
            }).promise().then(
                () => this._responseFactory.createRedirectResponse(this._createLink(resource.info, modifierString, signatureToken)),
                e => {
                    throw new InvalidStateError(e.message);
                }
            );
        } catch (e) {
            if (e instanceof FileNotFoundError) {
                const noImageResponse = this._getNoImageResponse(info, modifierString);

                if (null !== noImageResponse) {
                    return noImageResponse;
                }
            }

            throw e;
        }
    }

    _createCachedPath(info, modifierString) {
        const basePath = this._config.BASE_PATH.length ? (this._config.BASE_PATH + '/') : '';

        return `${basePath}${info.createCachedPath(modifierString)}`;
    }

    _getHostUrl() {
        return new URL(
            null !== this._config.HOST ? this._config.HOST : `https://${this._config.CACHE_BUCKET}.s3.${this._s3.config.region}.amazonaws.com`
        );
    }

    _createLink(info, modifierString, signatureToken = null) {
        const url = this._getHostUrl();
        url.pathname = this._createCachedPath(info, modifierString);

        if (null !== signatureToken) {
            url.searchParams.set(this._config.SIGNATURE_PARAMETER_NAME, signatureToken);
        }

        if (null !== info.version) {
            url.searchParams.set(this._config.SIGNATURE_PARAMETER_NAME, info.version);
        }

        return url.toString();
    }

    _createNoImageLink(info, modifierString) {
        const url = this._getHostUrl();
        const path = this._createCachedPath(info, modifierString);
        const signatureToken = this._signatureStrategy.createToken(path);

        url.pathname = path;

        if (null !== signatureToken) {
            url.searchParams.set(this._config.SIGNATURE_PARAMETER_NAME, signatureToken);
        }

        return url.toString();
    }

    _getNoImageResponse(info, modifierString) {
        try {
            const noImageInfo = this._noImageResolver.resolveNoImage(info.toString());

            noImageInfo.extension = info.extension;

            return this._responseFactory.createRedirectResponse(
                this._createNoImageLink(noImageInfo, modifierString)
            );
        } catch (e) {
            return null;
        }
    }
}

module.exports = ImageServer;
