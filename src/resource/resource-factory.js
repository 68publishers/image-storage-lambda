'use strict';

const Sharp = require('sharp');
const Resource = require('./resource');
const InvalidStateError = require('../error/invalid-state-error');
const FileNotFoundError = require('../error/file-not-found-error');

class ResourceFactory {
    constructor(s3, config, modifierFacade) {
        this._s3 = s3;
        this._config = config;
        this._modifierFacade = modifierFacade;
    }

    async create(imageInfo) {
        const promise = this._s3.getObject({
            Bucket: this._config.SOURCE_BUCKET,
            Key: imageInfo.createSourcePath()
        }).promise();

        return promise.then(
            response => new Resource(Sharp(response.Body), imageInfo, this._modifierFacade),
            (e) => {
                if ('NoSuchKey' === e.code) {
                    throw new FileNotFoundError(imageInfo.createSourcePath());
                }

                throw new InvalidStateError(e.message);
            }
        );
    }
}

module.exports = ResourceFactory;
