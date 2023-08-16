import { AppError } from './app-error.mjs'

export class FileNotFoundError extends AppError {
    constructor(filename) {
        super(`File ${filename} not found.`);
    }
}
