'use strict';

const InvalidStateError = require('../error/invalid-state-error');

class AbstractModifier {
    constructor(alias) {
        if (this.constructor === AbstractModifier) {
            throw new InvalidStateError('Can\'t construct an abstract class AbstractModifier.');
        }

        this._alias = alias;
    }

    get name() {
        return this.constructor.name;
    }

    get alias() {
        return this._alias;
    }
}

module.exports = AbstractModifier;
