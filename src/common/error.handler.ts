import { NextFunction, Request, Response } from 'express';
import { EnvConfig } from '../config/env';

export class CustomError extends Error {
    public statusCode: number;
    public success: boolean;

    constructor(message: string, statusCode: number, success: boolean = false) {
        super(message);
        this.statusCode = statusCode;
        this.success = success;

        // Ensure the error stack trace is captured
        Error.captureStackTrace(this, this.constructor);
    }
}


export const GlobalError = (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const success = err.success || false;
    const stack = err.stack;
    res.status(statusCode).json({
        success,
        message: err.message,
        statusCode,
        stack: EnvConfig.NODE_ENV === 'development' ? stack : undefined,
    });
};
