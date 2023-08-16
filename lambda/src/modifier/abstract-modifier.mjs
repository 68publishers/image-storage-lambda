import { InvalidStateError } from '../error/invalid-state-error.mjs';

export class AbstractModifier {
    #alias;

    constructor(alias) {
        if (this.constructor === AbstractModifier) {
            throw new InvalidStateError('Can\'t construct an abstract class AbstractModifier.');
        }

        this.#alias = alias;
    }

    get name() {
        return this.constructor.name;
    }

    get alias() {
        return this.#alias;
    }
}
