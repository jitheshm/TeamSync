import { CustomError } from "./CustomError";

export class InvalidCredentialsError extends CustomError {
    constructor(message?: string) {
        super(message ? message : "Invalid user name or password", 401);
    }
}