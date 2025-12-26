import 'dotenv/config';

const getSanitizedConfig = () => {
    const config = {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        // API_SECRET_KEY: process.env.API_SECRET_KEY
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
