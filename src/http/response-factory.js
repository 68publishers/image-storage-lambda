'use strict';

class ResponseFactory {
    createRedirectResponse(location) {
        return {
            statusCode: 307,
            headers: {
                'location': location
            }
        }
    }

    createErrorResponse(message, code = 500) {
        return {
            statusCode: code,
            body: JSON.stringify({
                code: code,
                error: message
            })
        }
    }
}

module.exports = ResponseFactory;
