import { CustomError } from "./CustomError";

export class InternalServerError extends CustomError {
    constructor() {
        super("An unexpected error occurred. Please try again later.", 500);
    }
}