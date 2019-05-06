'use strict';

class Modifier {
    constructor (baseUrl, path, originalPath, modifier, properties = {}) {
        this.baseUrl = baseUrl;
        this.path = path;
        this.originalPath = originalPath;
        this.properties = properties;
        this.modifier = modifier;
    }
    getPath () {
        return this.path;
    }
    getUrl () {
        return `${this.baseUrl}/${this.path}`;
    }
    getOriginalPath () {
        return this.originalPath;
    }
    getOriginalUrl () {
        return `${this.baseUrl}/${this.originalPath}`;
    }
    getModifier () {
        return this.modifier;
    }
    getProperties () {
        return this.properties;
    }
}

module.exports = Modifier;
