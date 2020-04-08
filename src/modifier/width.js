'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class Width extends require('./abstract-parsable-modifier') {
    constructor(alias = 'w') {
        super(alias);
    }

    parseValue(value) {
        if (Number.isNaN(value)) {
            throw new InvalidArgumentError('Width must be numeric value.');
        }

        return parseInt(value);
    }
}

module.exports = Width;
