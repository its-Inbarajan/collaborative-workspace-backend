"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
const passport_1 = __importDefault(require("passport"));
const auth_utils_1 = require("./auth.utils");
const ratelimit_1 = require("../common/ratelimit");
const env_1 = require("../config/env");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', ratelimit_1.authLimiter, auth_controller_1.register);
exports.authRouter.post('/login', ratelimit_1.authLimiter, auth_controller_1.login);
exports.authRouter.get('/me', auth_middleware_1.authenticate, auth_controller_1.me);
exports.authRouter.post('/refresh', ratelimit_1.authLimiter, auth_controller_1.refresh);
// Oauth
exports.authRouter.get('/oauth/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
exports.authRouter.get('/oauth/google/callback', passport_1.default.authenticate('google', { session: false }), async (req, res) => {
    const user = req.user;
    const accessToken = (0, auth_utils_1.generateAccessToken)(user);
    const refreshToken = await (0, auth_utils_1.generateRefreshToken)(user.id);
    res.redirect(`${env_1.EnvConfig.CLIENT_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});
