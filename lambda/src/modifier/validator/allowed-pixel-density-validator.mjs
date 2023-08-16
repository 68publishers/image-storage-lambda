import { AbstractValidator } from './abstract-validator.mjs';
import { InvalidStateError } from '../../error/invalid-state-error.mjs';

export class AllowedPixelDensityValidator extends AbstractValidator {
    validate(values) {
        if (0 >= this._config.ALLOWED_PIXEL_DENSITY.length) {
            return;
        }

        const pd = values.getOptional('PixelDensity');

        if (null === pd) {
            return;
        }

        if (!this._config.ALLOWED_PIXEL_DENSITY.includes(pd.toString())) {
            throw new InvalidStateError(`Invalid pixel density modifier, ${pd.toString()} is not supported.`);
        }
    }
}
