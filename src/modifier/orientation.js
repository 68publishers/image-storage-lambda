'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class Orientation extends require('./abstract-parsable-modifier') {
    constructor(alias = 'o') {
        super(alias);
    }

    static get VALUES() {
        return [ 'auto', '0', '90', '-90', '180', '-180', '270', '-270' ];
    }

    parseValue(value) {
        if (!Orientation.VALUES.includes(value)) {
            throw new InvalidArgumentError(`Value "${value}" is not valid orientation`);
        }

        return value;
    }
}

module.exports = Orientation;
