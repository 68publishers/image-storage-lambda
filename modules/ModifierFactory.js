'use strict';

const Modifier = require('./Modifier');

class ModifierFactory {
    constructor (propertiesOrCallback, baseUrl, originalModifier = 'original') {
        this.properties = typeof propertiesOrCallback === 'function'
            ? propertiesOrCallback
            : () => propertiesOrCallback;
        this.validators = [];
        this.baseUrl = baseUrl;
        this.originalModifier = originalModifier;
    }
    addValidator (validator) {
        if (typeof validator !== 'function') {
            throw 'Given argument must ba callable';
        }
        this.validators.push(validator);
    };
    create (uri) {
        const tryCatch = (key, callback) => {
            try {
                callback();
            } catch (e) {
                throw `Property error (${key}): ${e}`;
            }
        };
        let modifierString;
        let properties;
        let modifier;

        modifierString = (1 in ((modifierString = (new RegExp(`((([^\\/])+\\:([^\\/])+)|((?:[\\/])${this.originalModifier}(?:[\\/])))`)).exec(uri)) ? modifierString : [])) ? modifierString[1] : '';
        if (modifierString.indexOf(':') !== -1) {
            properties = this.properties();
            let uriModifiers = modifierString.split(',');
            const definedModifiers = [];
            for (let m in uriModifiers) {
                m = uriModifiers[m].split(':');
                if (!(m[0] in properties)) {
                    throw ('Undefined property ' + m[0])
                }
                tryCatch(m[0], () => {
                    properties[m[0]].setValue(m[1])
                });
                definedModifiers.push(m[0]);
            }

            let parts = [];
            let property;
            let urlValue;

            for (let key in properties) {
                if (properties.hasOwnProperty(key)) {
                    property = properties[key];
                    tryCatch(key, () => {
                        property.validate(properties)
                    });
                    urlValue = property.getValue();
                    if (null !== urlValue && definedModifiers.includes(key)) {
                        parts.push(key + ':' + urlValue)
                    }
                }
            }
            for (let key in this.validators) {
                this.validators[key](properties);
            }

            modifier = parts.join(',');
        } else if (modifierString === `/${this.originalModifier}/`) {
            modifier = this.originalModifier;
            properties = {};
        } else {
            throw ('Invalid uri ' + uri);
        }

        return new Modifier(
            this.baseUrl,
            uri,
            uri.replace(`/${modifier}/`, `/${this.originalModifier}/`),
            modifier,
            properties
        );
    }
}

module.exports = ModifierFactory;
