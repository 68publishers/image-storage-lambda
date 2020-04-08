'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class Height extends require('./abstract-parsable-modifier') {
    constructor(alias = 'h') {
        super(alias);
    }

    parseValue(value) {
        if (Number.isNaN(value)) {
            throw new InvalidArgumentError('Height must be numeric value.');
        }

        return parseInt(value);
    }
}

module.exports = Height;
