import { InvalidArgumentError } from '../../error/invalid-argument-error.mjs';

export class ModifierValues {
    #values;

    constructor(values = []) {
        this.#values = [];

        for (let key in values) {
            this.add(key, values[key]);
        }
    }

    add(name, value) {
        this.#values[name] = value;
    }

    has(name) {
        return name in this.#values;
    }

    get(name) {
        if (!this.has(name)) {
            throw new InvalidArgumentError(`Missing value for modifier ${name}.`);
        }

        return this.#values[name];
    }

    getOptional(name, _default = null) {
        return this.has(name) ? this.#values[name] : _default;
    }
}
