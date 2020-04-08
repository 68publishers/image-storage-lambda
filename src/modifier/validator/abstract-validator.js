'use strict';

const InvalidStateError = require('../../error/invalid-state-error');

class AbstractValidator {
    constructor(config) {
        if (this.constructor === AbstractValidator) {
            throw new InvalidStateError('Can\'t construct an abstract class AbstractValidator.');
        }

        this._config = config;
    }

    validate(values) {
        throw new InvalidStateError('Calling of an abstract method AbstractValidator::validate() is not allowed.');
    }
}

module.exports = AbstractValidator;
