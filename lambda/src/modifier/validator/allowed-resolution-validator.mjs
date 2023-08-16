import { AbstractValidator } from './abstract-validator.mjs';
import { InvalidStateError } from '../../error/invalid-state-error.mjs';

export class AllowedResolutionValidator extends AbstractValidator {
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
