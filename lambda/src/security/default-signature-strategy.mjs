import { createHmac } from 'node:crypto';
import { SignatureError } from '../error/signature-error.mjs';

export class DefaultSignatureStrategy {
    #config;

    constructor({ config }) {
        this.#config = config;
    }

    createToken(path) {
        if (!this.#config.SIGNATURE_KEY) {
            return null;
        }

        return createHmac(this.#config.SIGNATURE_ALGORITHM, this.#config.SIGNATURE_KEY).update(path).digest('hex');
    }

    verifyToken(token, path) {
        if (!this.#config.SIGNATURE_KEY) {
            return;
        }

        if (!token) {
            throw new SignatureError('Missing signature in request.');
        }

        if (path && '/' === path[0]) {
            path = path.slice(1);
        }

        if (this.createToken(path) !== token) {
            throw new SignatureError('Request contains invalid signature.');
        }
    }
}
