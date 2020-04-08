'use strict';

const crypto = require('crypto');
const SignatureError = require('../error/signature-error');

class DefaultSignatureStrategy {
    constructor(config) {
        this._config = config;
    }

    createToken(path) {
        if (!Boolean(this._config.SIGNATURE_KEY)) {
            return null;
        }

        return crypto.createHmac(this._config.SIGNATURE_ALGORITHM, this._config.SIGNATURE_KEY).update(path).digest('hex');
    }

    verifyToken(token, path) {
        if (!Boolean(this._config.SIGNATURE_KEY)) {
            return;
        }

        if (!Boolean(token)) {
            throw new SignatureError('Missing signature in request.');
        }

        if (path && '/' === path[0]) {
            path = path.substr(1);
        }

        if (this.createToken(path) !== token) {
            throw new SignatureError('Request contains invalid signature.');
        }
    }
}

module.exports = DefaultSignatureStrategy;
