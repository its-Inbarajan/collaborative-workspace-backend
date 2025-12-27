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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.refreshToken = refreshToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const constant_1 = require("../config/constant");
const authRepo = __importStar(require("./auth.repository"));
const auth_utils_1 = require("./auth.utils");
const error_handler_1 = require("../common/error.handler");
const db_1 = require("../common/db");
async function register(email, password) {
    const existingUser = await authRepo.findUserByEmail(email);
    if (existingUser) {
        throw new error_handler_1.CustomError('EMAIL_ALREADY_EXISTS', 409);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, constant_1.AppConstants.SALT_ROUNDS);
    const user = await authRepo.createUser(email, hashedPassword);
    const accessToken = (0, auth_utils_1.generateAccessToken)(user);
    const refreshToken = await (0, auth_utils_1.generateRefreshToken)(user.id);
    return {
        user,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}
async function login(email, password) {
    const user = await authRepo.findUserWithPassword(email);
    if (!user) {
        throw new error_handler_1.CustomError('User not found.', 403);
    }
    const passwordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        throw new error_handler_1.CustomError('Password mismatch.', 401);
    }
    const accessToken = (0, auth_utils_1.generateAccessToken)({
        id: user.id,
        role: user.role,
    });
    const refreshToken = await (0, auth_utils_1.generateRefreshToken)(user.id);
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}
async function getMe(userId) {
    const user = await authRepo.findUserById(userId);
    if (!user) {
        throw new error_handler_1.CustomError('USER_NOT_FOUND', 404);
    }
    return user;
}
async function refreshToken(refreshToken) {
    const result = await db_1.pool.query(`
        SELECT * FROM refresh_token
        WHERE token = $1 AND revoked = false AND expires_at > NOW() 
        `, [refreshToken]);
    const storedToken = result.rows[0];
    if (!storedToken) {
        throw new error_handler_1.CustomError('Invalid refresh token', 401);
    }
    await db_1.pool.query(`UPDATE refresh_tokens SET revoked = true WHERE id = $1`, [storedToken.id]);
    const newRefreshToken = await (0, auth_utils_1.generateRefreshToken)(storedToken.user_id);
    const accessToken = (0, auth_utils_1.generateAccessToken)({ id: storedToken.user_id, role: storedToken.role });
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
}
