import { CustomError } from "./CustomError";

export class InvalidCredentialsError extends CustomError {
    constructor() {
        super("Invalid user name or password", 401);
    }
}