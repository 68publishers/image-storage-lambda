import { InvalidStateError } from '../../error/invalid-state-error.mjs';

export class AbstractValidator {
    constructor(config) {
        if (this.constructor === AbstractValidator) {
            throw new InvalidStateError('Can\'t construct an abstract class AbstractValidator.');
        }

        this._config = config;
    }

    // eslint-disable-next-line
    validate(values) {
    }
}
