'use strict';

const InvalidStateError = require('../../error/invalid-state-error');

class AllowedResolutionValidator extends require('./abstract-validator') {
    validate(values) {
        if (0 >= this._config.ALLOWED_RESOLUTIONS.length) {
            return;
        }

        const width = values.getOptional('Width', '').toString();
        const height = values.getOptional('Height', '').toString();

        if (('' !== width || '' !== height) && !this._config.ALLOWED_RESOLUTIONS.includes(width + 'x' + height)) {
            throw new InvalidStateError(`Invalid combination of width and height modifiers, ${width}x${height} is not supported.`);
        }
    }
}

module.exports = AllowedResolutionValidator;
