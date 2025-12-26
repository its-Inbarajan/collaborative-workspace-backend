import { Pool } from 'pg';
import { EnvConfig } from '../config/env';

export const pool = new Pool({
    connectionString: EnvConfig.DATABASE_URL
})

export async function connectDB(): Promise<void> {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connected");
    } catch (err: unknown) {
        console.error("PostgreSQL connection failed", err);
        process.exit(1);
    }
}