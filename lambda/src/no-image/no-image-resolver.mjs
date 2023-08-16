import { ImageInfo } from '../resource/image-info.mjs';
import { InvalidStateError } from '../error/invalid-state-error.mjs';

export class NoImageResolver {
    #config;
    #data;

    constructor({ config }) {
        this.#config = config;
        this.#data = null;
    }

    getNoImage(name = null) {
        if (null === name) {
            return this.#getDefaultNoImage();
        }

        const data = this.#getData();

        if (!(name in data.paths)) {
            throw new InvalidStateError(`No-image with name "${name}" is not defined.`);
        }

        return new ImageInfo(data.paths[name]);
    }

    resolveNoImage(path) {
        const data = this.#getData();

        for (let name in data.patterns) {
            if (new RegExp(data.patterns[name]).test(path)) {
                return this.getNoImage(name);
            }
        }

        return this.getNoImage(null);
    }

    #getDefaultNoImage() {
        if (null === this.#getData().defaultPath) {
            throw new InvalidStateError('Default no-image path is not defined.');
        }

        return new ImageInfo(this.#getData().defaultPath);
    }

    // lazy parsing
    #getData() {
        if (null !== this.#data) {
            return this.#data;
        }

        const data = {
            defaultPath: null,
            paths: {},
            patterns: {},
        };
        const noImages = this.#config.NO_IMAGES;
        const patterns = this.#config.NO_IMAGE_PATTERNS;

        for (let i in noImages) {
            const parts = noImages[i].split('::');
            const name = parts.shift();

            if ('default' === name) {
                data.defaultPath = parts.join('::');

                continue;
            }

            data.paths[name] = parts.join('::');
        }

        for (let i in patterns) {
            const parts = patterns[i].split('::');
            const name = parts.shift();

            data.patterns[name] = parts.join('::');
        }

        this.#data = data;

        return this.#data;
    }
}
