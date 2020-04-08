'use strict';

class AppError extends Error {
    constructor (message, status) {
        // noinspection JSCheckFunctionSignatures
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
