import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';
import { FValidationError } from '../errors/ValidationError';


export default (err: CustomError | FValidationError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode) {
        if (err instanceof FValidationError) {
            return res.status(err.statusCode).json({ errors: err.messages, verified: false });
        } else {
            res.status(err.statusCode).json({ error: err.message, verified: false });
        }


    } else {
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}