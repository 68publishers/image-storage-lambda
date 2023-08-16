import { AbstractParsableModifier } from './abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class Orientation extends AbstractParsableModifier {
    constructor(alias = 'o') {
        super(alias);
    }

    static get VALUES() {
        return [ 'auto', '0', '90', '-90', '180', '-180', '270', '-270' ];
    }

    parseValue(value) {
        if (!Orientation.VALUES.includes(value)) {
            throw new InvalidArgumentError(`Value "${value}" is not valid orientation`);
        }

        return value;
    }
}
