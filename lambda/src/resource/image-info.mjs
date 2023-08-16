import { SupportedType } from '../helper/supported-type.mjs';

export class ImageInfo {
    #name;
    #namespace;
    #extension;
    #version;

    constructor(path) {
        const namespace = path.trim().replace(/^\/+|\/+$/g, '').split('/');
        const name = namespace.pop().split('.');
        const extension = 1 < name.length ? name.pop() : null;

        this.#name = name.join('.');
        this.#namespace = namespace.join('/');
        this.#extension = extension;
        this.#version = null;
    }

    get name() {
        return this.#name;
    }

    get namespace() {
        return this.#namespace;
    }

    get extension() {
        return this.#extension;
    }

    set extension(extension) {
        this.#extension = extension;
    }

    get version() {
        return this.#version;
    }

    set version(version) {
        this.#version = version;
    }

    createCachedPath(modifier) {
        const extension = null !== this.extension ? this.extension : SupportedType.getDefaultExtension();

        return '' === this.namespace
            ? `${modifier}/${this.name}.${extension}`
            : `${this.namespace}/${modifier}/${this.name}.${extension}`;
    }

    createSourcePath() {
        return '' === this.namespace
            ? this.name
            : `${this.namespace}/${this.name}`;
    }

    toString() {
        return this.createSourcePath() + (null === this.extension ? '' : '.' + this.extension);
    }
}
