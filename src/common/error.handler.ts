import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class CustomError extends Error {
    status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.status = status;

        Error.captureStackTrace(this, this.constructor);
    }
}


export const GlobalError = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Custom application errors
    if (err instanceof CustomError) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }

    // Validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Unknown / programmer errors
    console.error(err);

    return res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};
