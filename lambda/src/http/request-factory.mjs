import { Request } from './request.mjs';

export class RequestFactory {
    create(event) {
        return new Request(event.path, event.queryStringParameters || {});
    }
}
