import { InvalidStateError } from '../error/invalid-state-error.mjs';

export class Config {
    constructor() {
        const config = {
            BASE_PATH: '',
            HOST: null,
            MODIFIER_SEPARATOR: ',',
            MODIFIER_ASSIGNER: ':',
            VERSION_PARAMETER_NAME: '_v',
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
            CACHE_BUCKET: null,
        };

        const env = process.env || {};

        for (let key in env) {
            if (key in config) {
                config[key] = env[key];
            }
        }

        // check buckets
        if (!config.SOURCE_BUCKET) {
            throw new InvalidStateError('Env variable SOURCE_BUCKET is missing.');
        }

        if (!config.CACHE_BUCKET) {
            throw new InvalidStateError('Env variable CACHE_BUCKET is missing.');
        }

        // remove slashes from BASE_PATH and HOST variables
        if (config.BASE_PATH.length && '/' === config.BASE_PATH[0]) {
            config.BASE_PATH = config.BASE_PATH.slice(1);
        }

        if (config.BASE_PATH.length && '/' === config.BASE_PATH[config.BASE_PATH.length - 1]) {
            config.BASE_PATH = config.BASE_PATH.slice(0, -1);
        }

        if (null !== config.HOST && '/' === config.HOST[config.HOST.length - 1]) {
            config.HOST = config.HOST.slice(0, -1);
        }

        // convert arrays
        config.ALLOWED_PIXEL_DENSITY = this.#convertList(config.ALLOWED_PIXEL_DENSITY);
        config.ALLOWED_RESOLUTIONS = this.#convertList(config.ALLOWED_RESOLUTIONS);
        config.ALLOWED_QUALITIES = this.#convertList(config.ALLOWED_QUALITIES);
        config.NO_IMAGES = this.#convertList(config.NO_IMAGES);
        config.NO_IMAGE_PATTERNS = this.#convertList(config.NO_IMAGE_PATTERNS);

        // save values to `this`
        for (let k in config) {
            this[k] = config[k];
        }
    }

    #convertList = (value) => {
        if (!value) {
            return [];
        }

        return value.split(',').map(item => item.trim());
    }
}
