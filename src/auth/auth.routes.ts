import { Router } from 'express';
import { login, me, refresh, register } from './auth.controller';
import { authenticate } from './auth.middleware';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from './auth.utils';
import { authLimiter } from '../common/ratelimit';
import { EnvConfig } from '../config/env';


export const authRouter = Router();

authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);
authRouter.get('/me', authenticate, me);
authRouter.post('/refresh', authLimiter, refresh);


// Oauth
authRouter.get('/oauth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

authRouter.get(
    '/oauth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        const user = req.user as any;

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user.id);

        res.redirect(
            `${EnvConfig.CLIENT_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
        );
    })