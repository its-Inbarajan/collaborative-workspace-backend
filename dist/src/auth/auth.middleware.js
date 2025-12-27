"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const error_handler_1 = require("../common/error.handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new error_handler_1.CustomError('Missing token', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.EnvConfig.JWT_ACCESS_SECRET);
        req.user = {
            id: payload.id,
            role: payload.role
        };
        next();
    }
    catch (error) {
        next(error);
    }
}
