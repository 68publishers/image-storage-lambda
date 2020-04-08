'use strict';

const InvalidArgumentError = require('../../error/invalid-argument-error');

class ModifierValues {
    constructor(values = []) {
        this._values = [];

        for (let key in values) {
            this.add(key, values[key]);
        }
    }

    add(name, value) {
        this._values[name] = value;
    }

    has(name) {
        return name in this._values;
    }

    get(name) {
        if (!this.has(name)) {
            throw new InvalidArgumentError(`Missing value for modifier ${name}.`);
        }

        return this._values[name];
    }

    getOptional(name, _default = null) {
        return this.has(name) ? this._values[name] : _default;
    }
}

module.exports = ModifierValues;
