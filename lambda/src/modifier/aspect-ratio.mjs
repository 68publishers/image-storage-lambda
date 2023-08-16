import { AbstractParsableModifier } from './abstract-parsable-modifier.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class AspectRatio extends AbstractParsableModifier {
    constructor(alias = 'ar') {
        super(alias);
    }

    parseValue(value) {
        const ratio = value.split('x');

        if (2 !== ratio.length || Number.isNaN(ratio[0]) || Number.isNaN(ratio[1])) {
            throw new InvalidArgumentError(`A value "${value}" is not a valid aspect ratio.`);
        }

        return {
            w: parseFloat(ratio[0]),
            h: parseFloat(ratio[1]),
        };
    }
}
