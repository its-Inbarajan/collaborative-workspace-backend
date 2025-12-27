"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = exports.CustomError = void 0;
const zod_1 = require("zod");
class CustomError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const GlobalError = (err, _req, res, _next) => {
    // Custom application errors
    if (err instanceof CustomError) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }
    // Validation errors
    if (err instanceof zod_1.ZodError) {
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
exports.GlobalError = GlobalError;
