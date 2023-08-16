import { AbstractParsableModifier } from './abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class PixelDensity extends AbstractParsableModifier {
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
