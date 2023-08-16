import { AbstractValidator } from './abstract-validator.mjs';
import { InvalidStateError } from '../../error/invalid-state-error.mjs';

export class AllowedQualityValidator extends AbstractValidator {
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
