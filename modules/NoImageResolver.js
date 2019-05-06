'use strict';

class NoImageResolver {
    constructor (baseUrl, defaultNamespace, defaultFilename) {
        this.baseUrl = baseUrl;
        this.default = [
            defaultNamespace,
            defaultFilename
        ];
        this.noimages = [];
    }
    add (namespace, filename, resolveCallback) {
        if (typeof resolveCallback !== 'function') {
            throw 'Resolver callback must be callable.';
        }

        this.noimages.push([
            namespace,
            filename,
            resolveCallback
        ]);
    }
    getNoImageUrl (modifier) {
        for (let key in this.noimages) {
            let args = this.noimages[key];
            if (true === args[2](modifier)) {
                return `${args[0]}/${modifier.getModifier()}/${args[1]}`;
            }
        }

        return `${this.baseUrl}/${this.default[0]}/${modifier.getModifier()}/${this.default[1]}`;
    }
    isNoImage (modifier) {
        for (let key in this.noimages) {
            let args = this.noimages[key];
            if (`${args[0]}/${modifier.getModifier()}/${args[1]}` === modifier.getPath()) {
                return true;
            }
        }

        return `${this.default[0]}/${modifier.getModifier()}/${this.default[1]}` === modifier.getPath();
    }
}

module.exports = NoImageResolver;
