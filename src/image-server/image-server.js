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
        this._signatureStrategy.verifyToken(request.hasQuery(this._config.SIGNATURE_PARAMETER_NAME) ? request.getQuery(this._config.SIGNATURE_PARAMETER_NAME) : null, path);

        // parse image info & modifiers
        const parts = path.split('/');
        const pathCount = parts.length;

        if (2 > pathCount) {
            throw new InvalidStateError('Missing modifier in requested path.');
        }

        const modifierString = parts[pathCount - 2];
        parts.splice(pathCount - 2, 1);

        const info = new ImageInfo(parts.join('/'));

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
                () => this._responseFactory.createRedirectResponse(this._createLink(resource.info, modifierString)),
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

    _createLink(info, modifierString, addSignature = false) {
        const host = null !== this._config.HOST ? this._config.HOST : `https://${this._config.CACHE_BUCKET}.s3.${this._s3.config.region}.amazonaws.com`;
        let path = this._createCachedPath(info, modifierString);

        if (addSignature) {
            path += `?${this._config.SIGNATURE_PARAMETER_NAME}=${this._signatureStrategy.createToken(path)}`;
        }

        return `${host}/${path}`;
    }

    _getNoImageResponse(info, modifierString) {
        try {
            const noImageInfo = this._noImageResolver.resolveNoImage(info.toString());

            noImageInfo.extension = info.extension;

            return this._responseFactory.createRedirectResponse(
                this._createLink(noImageInfo, modifierString, true)
            );
        } catch (e) {
            return null;
        }
    }
}

module.exports = ImageServer;
