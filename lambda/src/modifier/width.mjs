import { AbstractParsableModifier } from './abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class Width extends AbstractParsableModifier {
    constructor(alias = 'w') {
        super(alias);
    }

    parseValue(value) {
        if (Number.isNaN(value)) {
            throw new InvalidArgumentError('Width must be numeric value.');
        }

        return parseInt(value);
    }
}
