"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
exports.refresh = refresh;
const auth_schema_1 = require("./auth.schema");
const authService = __importStar(require("./auth.service"));
const error_handler_1 = require("../common/error.handler");
async function register(req, res, next) {
    try {
        const parsed = auth_schema_1.userAuthSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new error_handler_1.CustomError('Invalid request data', 400);
        }
        const input = parsed.data;
        const result = await authService.register(input.email, input.password);
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const parsed = auth_schema_1.userAuthSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new error_handler_1.CustomError('Invalid request data', 400);
        }
        const result = await authService.login(parsed.data.email, parsed.data.password);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
}
async function me(req, res, next) {
    try {
        // const response = req?.user;
        // const id = req.user?.id
        // const user = await authService.getMe(id as string);
        // res.status(200).json({
        //     success: true,
        //     data: user,
        // });
        if (!req.user) {
            throw new error_handler_1.CustomError('Unauthorized', 401);
        }
        res.json({
            id: req.user.id,
            role: req.user.role,
        });
    }
    catch (error) {
        next(error);
    }
}
async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new error_handler_1.CustomError('Refresh token required', 400);
        }
        const tokens = await authService.refreshToken(refreshToken);
        res.status(200).json({
            success: true,
            data: tokens,
        });
    }
    catch (error) {
        next(error);
    }
}
