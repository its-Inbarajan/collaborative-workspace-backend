import 'dotenv/config';

const getSanitizedConfig = () => {
    const config = {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        CLIENT_URL: process.env.CLIENT_URL,
        REDIS_URL: process.env.REDIS_URL,
        TEST_REDIS_URL: process.env.TEST_REDIS_URL,
        TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    }

    // Check if any values are got undifined
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} is env variables`)
        }
    }

    return config as Readonly<typeof config>
}

export const EnvConfig = getSanitizedConfig();
