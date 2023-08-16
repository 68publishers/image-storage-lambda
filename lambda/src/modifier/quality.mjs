import { AbstractParsableModifier } from './abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class Quality extends AbstractParsableModifier {
    constructor(alias = 'q') {
        super(alias);
    }

    parseValue(value) {
        if (Number.isNaN(value)) {
            throw new InvalidArgumentError('Quality must be numeric value.');
        }

        value = parseInt(value);

        if (0 >= value || 100 < value) {
            throw new InvalidArgumentError('Quality must be int between 0 and 100.');
        }

        return value;
    }
}
