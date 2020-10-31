'use strict';

const InvalidStateError = require('../error/invalid-state-error');

class Config {
    constructor() {
        const config = {
            BASE_PATH: '',
            HOST: null,
            MODIFIER_SEPARATOR: ',',
            MODIFIER_ASSIGNER: ':',
            SIGNATURE_PARAMETER_NAME: '_s',
            SIGNATURE_KEY: null,
            SIGNATURE_ALGORITHM: 'sha256',
            ALLOWED_PIXEL_DENSITY: '',
            ALLOWED_RESOLUTIONS: '',
            ALLOWED_QUALITIES: '',
            ENCODE_QUALITY: 90,
            CACHE_MAX_AGE: 31536000,

            NO_IMAGES: '',
            NO_IMAGE_PATTERNS: '',

            SOURCE_BUCKET: null,
            CACHE_BUCKET: null
        };

        const env = process.env || {};

        for (let key in env) {
            if (!env.hasOwnProperty(key)) {
                continue;
            }

            if (config.hasOwnProperty(key)) {
                config[key] = env[key];
            }
        }

        // check buckets
        if (!Boolean(config.SOURCE_BUCKET)) {
            throw new InvalidStateError('Env variable SOURCE_BUCKET is missing.');
        }

        if (!Boolean(config.CACHE_BUCKET)) {
            throw new InvalidStateError('Env variable CACHE_BUCKET is missing.');
        }

        // remove slashes from BASE_PATH and HOST variables
        if (config.BASE_PATH.length && '/' === config.BASE_PATH[0]) {
            config.BASE_PATH = config.BASE_PATH.substr(1);
        }

        if (config.BASE_PATH.length && '/' === config.BASE_PATH[config.BASE_PATH.length - 1]) {
            config.BASE_PATH = config.BASE_PATH.slice(0, -1);
        }

        if (null !== config.HOST && '/' === config.HOST[config.HOST.length - 1]) {
            config.HOST = config.HOST.slice(0, -1);
        }

        // convert arrays
        config.ALLOWED_PIXEL_DENSITY = this._convertList(config.ALLOWED_PIXEL_DENSITY);
        config.ALLOWED_RESOLUTIONS = this._convertList(config.ALLOWED_RESOLUTIONS);
        config.ALLOWED_QUALITIES = this._convertList(config.ALLOWED_QUALITIES);
        config.NO_IMAGES = this._convertList(config.NO_IMAGES);
        config.NO_IMAGE_PATTERNS = this._convertList(config.NO_IMAGE_PATTERNS);

        // save values to `this`
        for (let k in config) {
            this[k] = config[k];
        }
    }

    _convertList = (value) => {
        if (!Boolean(value)) {
            return [];
        }

        return value.split(',').map(item => item.trim());
    }
}

module.exports = Config;
