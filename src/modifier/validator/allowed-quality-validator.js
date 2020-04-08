'use strict';

const InvalidStateError = require('../../error/invalid-state-error');

class AllowedQualityValidator extends require('./abstract-validator') {
    validate(values) {
        if (0 >= this._config.ALLOWED_QUALITIES.length) {
            return;
        }

        const quality = values.getOptional('Quality');

        if (null === quality) {
            return;
        }

        if (!this._config.ALLOWED_QUALITIES.includes(quality.toString())) {
            throw new InvalidStateError(`Invalid quality modifier, ${quality.toString()} is not supported.`);
        }
    }
}

module.exports = AllowedQualityValidator;
