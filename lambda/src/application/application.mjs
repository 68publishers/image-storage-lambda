import { SignatureError } from '../error/signature-error.mjs';
import { FileNotFoundError } from '../error/file-not-found-error.mjs';

export class Application {
    #requestFactory;
    #responseFactory;
    #imageServer;

    constructor({ requestFactory, responseFactory, imageServer }) {
        this.#requestFactory = requestFactory;
        this.#responseFactory = responseFactory;
        this.#imageServer = imageServer;
    }

    async run(event) {
        try {
            return await this.#imageServer.getImageResponse(this.#requestFactory.create(event));
        } catch (err) {
            if (err instanceof FileNotFoundError) {
                return this.#responseFactory.createErrorResponse(err, 404);
            }

            if (err instanceof SignatureError) {
                return this.#responseFactory.createErrorResponse(err, 403);
            }

            err.message = 'Internal server error. ' + err.message;

            return this.#responseFactory.createErrorResponse(err, 500);
        }
    }
}
