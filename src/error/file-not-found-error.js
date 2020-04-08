'use strict';

module.exports = class FileNotFoundError extends require('./app-error') {
    constructor(filename) {
        super(`File ${filename} not found.`);
    }
};
