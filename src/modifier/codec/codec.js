'use strict';

const AbstractParsableModifier = require('../abstract-parsable-modifier');
const InvalidArgumentError = require('../../error/invalid-argument-error');

class Codec {
    constructor(config, modifierCollection) {
        this._config = config;
        this._modifierCollection = modifierCollection;
    }

    decode(path) {
        if (!path) {
            throw new InvalidArgumentError('Path can\`t be empty.');
        }

        const parameters = {};
        const assigner = this._config.MODIFIER_ASSIGNER;
        const modifiers = path.split(this._config.MODIFIER_SEPARATOR);

        for (let k in modifiers) {
            if (!modifiers.hasOwnProperty(k)) {
                continue;
            }

            const modifier = modifiers[k].split(assigner);
            const count = modifier.length;

            if (1 > count || 2 < count) {
                throw new InvalidArgumentError(`An invalid path "${path}" passed, a modifier "${modifier.join(assigner)}" has invalid format.`);
            }

            const modifierObject = this._modifierCollection.getByAlias(modifier[0]);

            if (1 === count && modifierObject instanceof AbstractParsableModifier) {
                throw new InvalidArgumentError(`An invalid path "${path}" passed, a modifier "${modifierObject.alias}" must have a value.`);
            }

            if (2 === count && !(modifierObject instanceof AbstractParsableModifier)) {
                throw new InvalidArgumentError(`An invalid path "${path}" passed, a modifier "${modifierObject.alias}" can\'t have a value.`);
            }

            parameters[modifierObject.alias] = 2 === count ? modifier[1] : true;
        }

        return parameters;
    }
}

module.exports = Codec;
