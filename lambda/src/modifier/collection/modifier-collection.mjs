import { ModifierValues } from './modifier-values.mjs';
import { AbstractParsableModifier } from '../abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../../error/invalid-argument-error.mjs';

export class ModifierCollection {
    #modifiers;
    #aliases;

    constructor() {
        this.#modifiers = {};
        this.#aliases = {};
    }

    add(modifier) {
        const name = modifier.name;
        const alias = modifier.alias;

        if (this.hasByName(name) || this.hasByAlias(alias)) {
            throw new InvalidArgumentError(`Duplicate modifier with name "${name}" and alias "${alias}" passed into ModifierCollection::add(). Name and alias must be unique.`);
        }

        this.#modifiers[name] = modifier;
        this.#aliases[alias] = name;
    }

    hasByName(name) {
        return name in this.#modifiers;
    }

    hasByAlias(alias) {
        return alias in this.#aliases && this.hasByName(this.#aliases[alias]);
    }

    getByName(name) {
        if (!this.hasByName(name)) {
            throw new InvalidArgumentError(`Modifier with name "${name}" is not defined in collection.`);
        }

        return this.#modifiers[name];
    }

    getByAlias(alias) {
        if (!this.hasByAlias(alias)) {
            throw new InvalidArgumentError(`Modifier with alias "${alias}" is not defined in collection.`);
        }

        return this.#modifiers[this.#aliases[alias]];
    }

    parseValues(parameters) {
        const values = [];
        let k, v, modifier;

        for (k in parameters) {
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
        return this.#modifiers.values();
    }
}
