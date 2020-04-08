'use strict';

const ModifierValues = require('./modifier-values');
const AbstractParsableModifier = require('../abstract-parsable-modifier');
const InvalidArgumentError = require('../../error/invalid-argument-error');

class ModifierCollection {
    constructor() {
        this._modifiers = {};
        this._aliases = {};
    }

    add (modifier) {
        const   name = modifier.name,
                alias = modifier.alias;

        if (this.hasByName(name) || this.hasByAlias(alias)) {
            throw new InvalidArgumentError(`Duplicate modifier with name "${name}" and alias "${alias}" passed into ModifierCollection::add(). Name and alias must be unique.`);
        }

        this._modifiers[name] = modifier;
        this._aliases[alias] = name;
    }

    hasByName(name) {
        return name in this._modifiers;
    }

    hasByAlias(alias) {
        return alias in this._aliases && this.hasByName(this._aliases[alias]);
    }

    getByName(name) {
        if (!this.hasByName(name)) {
            throw new InvalidArgumentError(`Modifier with name "${name}" is not defined in collection.`);
        }

        return this._modifiers[name];
    }

    getByAlias(alias) {
        if (!this.hasByAlias(alias)) {
            throw new InvalidArgumentError(`Modifier with alias "${alias}" is not defined in collection.`);
        }

        return this._modifiers[this._aliases[alias]];
    }

    parseValues(parameters) {
        const values = [];
        let k, v, modifier;

        for (k in parameters) {
            if (!parameters.hasOwnProperty(k)) {
                continue;
            }

            v = parameters[k];
            modifier = this.getByAlias(k);

            if (modifier instanceof AbstractParsableModifier) {
                const value = modifier.parseValue(v);

                if (null !== value) {
                    values[modifier.name] = value;
                }

                continue;
            }

            if (true === Boolean(v)) {
                values[modifier.name] = true;
            }
        }

        return new ModifierValues(values);
    }

    [Symbol.iterator]() {
        return this._modifiers.values();
    }
}

module.exports = ModifierCollection;
