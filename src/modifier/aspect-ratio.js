'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class AspectRatio extends require('./abstract-parsable-modifier') {
    constructor(alias = 'ar') {
        super(alias);
    }

    parseValue(value) {
        const ratio = value.split('x');

        if (2 !== ratio.length || Number.isNaN(ratio[0]) || Number.isNaN(ratio[1])) {
            throw new InvalidArgumentError(`A value "${value}" is not a valid aspect ratio.`);
        }

        return {
            w: parseFloat(ratio[0]),
            h: parseFloat(ratio[1])
        };
    }
}

module.exports = AspectRatio;
