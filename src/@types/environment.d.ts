declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        DATABASE_URL: string;
        API_SECRET_KEY: string;
        PORT: string
        DATABASE_URL: string
        NODE_ENV: string
        JWT_ACCESS_SECRET: string
        GOOGLE_CLIENT_ID: string
        GOOGLE_CLIENT_SECRET: string
        GOOGLE_CALLBACK_URL: string
        CLIENT_URL: string
    }
}

export { }