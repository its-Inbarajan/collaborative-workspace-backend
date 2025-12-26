declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        DATABASE_URL: string;
        API_SECRET_KEY: string;
    }
}

export { }