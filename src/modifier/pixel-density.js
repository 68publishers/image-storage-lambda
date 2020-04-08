'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class PixelDensity extends require('./abstract-parsable-modifier') {
    constructor(alias = 'pd') {
        super(alias);
    }

    parseValue(value) {
        if (Number.isNaN(value)) {
            throw new InvalidArgumentError('Pixel density must be numeric.');
        }

        value = parseFloat(value);

        if (0 >= value && 8 < value) {
            throw new InvalidArgumentError(`Pixel density ${value} is not valid, value must be between 1 and 8.`);
        }

        return value;
    }
}

module.exports = PixelDensity;
