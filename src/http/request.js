'use strict';

const InvalidStateError = require('../error/invalid-state-error');
const InvalidArgumentError = require('../error/invalid-argument-error');

class Request {
    constructor(path, queryParameters) {
        if (!path) {
            throw new InvalidStateError('Request path is empty.');
        }

        this._path = path;
        this._queryParameters = queryParameters;
    }

    get path() {
        return this._path;
    }

    get queryParameters() {
        return this._queryParameters;
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

module.exports = Request;
