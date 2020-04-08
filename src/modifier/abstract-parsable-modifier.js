'use strict';

const InvalidStateError = require('../error/invalid-state-error');

class AbstractParsableModifier extends require('./abstract-modifier') {
    constructor(alias) {
        super(alias);

        if (this.constructor === AbstractParsableModifier) {
            throw new InvalidStateError('Can not construct an abstract class AbstractParsableModifier.');
        }
    }

    parseValue(value) {
        throw new InvalidStateError('Calling of an abstract method AbstractParsableModifier::parseValue() is not allowed.');
    }
}

module.exports = AbstractParsableModifier;
