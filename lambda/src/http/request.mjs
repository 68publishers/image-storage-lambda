import { InvalidStateError } from '../error/invalid-state-error.mjs';
import { InvalidArgumentError } from '../error/invalid-argument-error.mjs';

export class Request {
    #path;
    #queryParameters;

    constructor(path, queryParameters) {
        if (!path) {
            throw new InvalidStateError('Request path is empty.');
        }

        this.#path = path;
        this.#queryParameters = queryParameters;
    }

    get path() {
        return this.#path;
    }

    get queryParameters() {
        return this.#queryParameters;
    }

    hasQuery(name) {
        return name in this.queryParameters;
    }

    getQuery(name) {
        if (!this.hasQuery(name)) {
            throw new InvalidArgumentError(`Missing query parameter "${name}".`);
        }

        return this.queryParameters[name];
    }
}
