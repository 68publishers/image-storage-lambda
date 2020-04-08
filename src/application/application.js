'use strict';

const SignatureError = require('../error/signature-error');
const FileNotFoundError = require('../error/file-not-found-error');

class Application {
    constructor(requestFactory, responseFactory, imageServer) {
        this._requestFactory = requestFactory;
        this._responseFactory = responseFactory;
        this._imageServer = imageServer;
    }

    async run(event) {
        try {
            return await this._imageServer.getImageResponse(this._requestFactory(event));
        } catch (e) {
            if (e instanceof FileNotFoundError) {
                return this._responseFactory.createErrorResponse('File not found.', 404);
            }

            if (e instanceof SignatureError) {
                return this._responseFactory.createErrorResponse(e.message, 403);
            }

            return this._responseFactory.createErrorResponse(`Internal server error. ${e.message}`);
        }
    }
}

module.exports = Application;
