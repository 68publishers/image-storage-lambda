'use strict';

const ImageInfo = require('../resource/image-info');
const InvalidStateError = require('../error/invalid-state-error');

class NoImageResolver {
    constructor(config) {
        this._config = config;
        this._data = null;
    }

    getNoImage(name = null) {
        if (null === name) {
            return this._getDefaultNoImage();
        }

        const data = this._getData();

        if (!(name in data.paths)) {
            throw new InvalidStateError(`No-image with name "${name}" is not defined.`);
        }

        return new ImageInfo(data.paths[name]);
    }

    resolveNoImage(path) {
        const data = this._getData();

        for (let name in data.patterns) {
            if (!data.patterns.hasOwnProperty(name)) {
                continue;
            }

            if (new RegExp(data.patterns[name]).test(path)) {
                return this.getNoImage(name);
            }
        }

        return this.getNoImage(null);
    }

    _getDefaultNoImage() {
        if (null === this._getData().defaultPath) {
            throw new InvalidStateError('Default no-image path is not defined.');
        }

        return new ImageInfo(this._getData().defaultPath);
    }

    // lazy parsing
    _getData() {
        if (null !== this._data) {
            return this._data;
        }

        const data = {
            defaultPath: null,
            paths: {},
            patterns: {}
        };
        const noImages = this._config.NO_IMAGES;
        const patterns = this._config.NO_IMAGE_PATTERNS;

        for (let i in noImages) {
            if (!noImages.hasOwnProperty(i)) {
                continue;
            }

            const parts = noImages[i].split('::');
            const name = parts.shift();

            if ('default' === name) {
                data.defaultPath = parts.join('::');

                continue;
            }

            data.paths[name] = parts.join('::');
        }

        for (let i in patterns) {
            if (!patterns.hasOwnProperty(i)) {
                continue;
            }

            const parts = patterns[i].split('::');
            const name = parts.shift();

            data.patterns[name] = parts.join('::');
        }

        this._data = data;

        return this._data;
    }
}

module.exports = NoImageResolver;
