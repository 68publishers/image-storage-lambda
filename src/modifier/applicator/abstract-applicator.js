'use strict';

const InvalidStateError = require('../../error/invalid-state-error');

class AbstractApplicator {
    constructor(config) {
        if (this.constructor === AbstractApplicator) {
            throw new InvalidStateError('Can\'t construct an abstract class AbstractApplicator.');
        }

        this._config = config;
    }

    async apply(image, info, values) {
        throw new InvalidStateError('Calling of an abstract method AbstractApplicator::apply() is not allowed.');
    }
}

module.exports = AbstractApplicator;
