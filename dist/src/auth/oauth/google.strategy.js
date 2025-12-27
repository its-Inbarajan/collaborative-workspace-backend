"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("../../config/env");
const auth_repository_1 = require("../auth.repository");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.EnvConfig.GOOGLE_CLIENT_ID,
    clientSecret: env_1.EnvConfig.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.EnvConfig.GOOGLE_CALLBACK_URL
}, async (_accessToke, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email) {
            return done(null, false);
        }
        let findUser = await (0, auth_repository_1.findUserByEmail)(email);
        if (!findUser) {
            findUser = await (0, auth_repository_1.createOAuthUser)({
                email,
                provider: 'google',
                providerId: profile.id,
            });
        }
        done(null, false);
    }
    catch (error) {
        done(error, false);
    }
}));
