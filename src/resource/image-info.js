'use strict';

const SupportedType = require('../helper/supported-type');

class ImageInfo {
    constructor(path) {
        const namespace = path.trim().replace(/^\/+|\/+$/g, '').split('/');
        const name = namespace.pop().split('.');
        const extension = 1 < name.length ? name.pop() : null;

        this._name = name.join('.');
        this._namespace = namespace.join('/');
        this._extension = extension;
    }

    get name() {
        return this._name;
    }

    get namespace() {
        return this._namespace;
    }

    get extension() {
        return this._extension;
    }

    set extension(extension) {
        this._extension = extension;
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

module.exports = ImageInfo;
