export class ResponseFactory {
    createRedirectResponse(location) {
        return {
            statusCode: 307,
            headers: {
                'location': location,
            },
        }
    }

    createErrorResponse(err, code) {
        return {
            statusCode: code,
            body: JSON.stringify({
                code: code,
                error: err.message,
                stack: err.stack,
            }),
        }
    }
}
