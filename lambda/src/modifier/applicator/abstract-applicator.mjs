import { InvalidStateError } from '../../error/invalid-state-error.mjs';

export class AbstractApplicator {
    constructor(config) {
        if (this.constructor === AbstractApplicator) {
            throw new InvalidStateError('Can\'t construct an abstract class AbstractApplicator.');
        }

        this._config = config;
    }

    // eslint-disable-next-line
    async apply(image, info, values) {
        return image;
    }
}
