import { AbstractParsableModifier } from './abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class Height extends AbstractParsableModifier {
    constructor(alias = 'h') {
        super(alias);
    }

    parseValue(value) {
        if (Number.isNaN(value)) {
            throw new InvalidArgumentError('Height must be numeric value.');
        }

        return parseInt(value);
    }
}
