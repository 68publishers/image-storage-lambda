import { AbstractModifier } from './abstract-modifier.mjs';
import { InvalidStateError } from '../error/invalid-state-error.mjs';

export class AbstractParsableModifier extends AbstractModifier {
    constructor(alias) {
        super(alias);

        if (this.constructor === AbstractParsableModifier) {
            throw new InvalidStateError('Can not construct an abstract class AbstractParsableModifier.');
        }
    }

    parseValue(value) {
        return value;
    }
}
