import passport from "passport";

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { EnvConfig } from "../../config/env";
import { createOAuthUser, findUserByEmail } from "../auth.repository";

passport.use(
    new GoogleStrategy(
        {
            clientID: EnvConfig.GOOGLE_CLIENT_ID!,
            clientSecret: EnvConfig.GOOGLE_CLIENT_SECRET!,
            callbackURL: EnvConfig.GOOGLE_CALLBACK_URL!
        }, async (_accessToke, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false);
                }

                let findUser = await findUserByEmail(email)
                if (!findUser) {
                    findUser = await createOAuthUser({
                        email,
                        provider: 'google',
                        providerId: profile.id,
                    });
                }
                done(null, false)
            } catch (error: unknown) {
                done(error, false)
            }
        }
    )
)