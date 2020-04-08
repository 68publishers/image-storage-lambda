'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class SupportedType {
    static get SUPPORTED_TYPES() {
        return {
            gif: 'image/gif',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            pjpg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp'
        };
    }

    static get DEFAULT() {
        return ['jpg', 'image/jpeg'];
    }

    static getSupportedTypes() {
        return [ ...new Set(Object.values(SupportedType.SUPPORTED_TYPES))];
    }

    static getSupportedExtensions() {
        return Object.keys(SupportedType.SUPPORTED_TYPES);
    }

    static getDefaultExtension() {
        return SupportedType.DEFAULT[0];
    }

    static getDefaultType() {
        return SupportedType.DEFAULT[1];
    }

    static isTypeSupported(type) {
        return Object.values(SupportedType.SUPPORTED_TYPES).includes(type);
    }

    static isExtensionSupported(extension) {
        return extension in SupportedType.SUPPORTED_TYPES;
    }

    static getTypeByExtension(extension) {
        if (!SupportedType.isExtensionSupported(extension)) {
            throw new InvalidArgumentError(`Extension .${extension} is not supported.`);
        }

        return SupportedType.SUPPORTED_TYPES[extension];
    }

    static getExtensionByType(type) {
        if (!SupportedType.isTypeSupported(type)) {
            throw new InvalidArgumentError(`Mime type ${type} is not supported.`);
        }

        return Object.keys(SupportedType.SUPPORTED_TYPES).find(key => SupportedType.SUPPORTED_TYPES[key] === type);
    }
}

module.exports = SupportedType;
