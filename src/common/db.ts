import { Pool } from 'pg';
import { EnvConfig } from '../config/env';


const DB_URL = EnvConfig.NODE_ENV! === 'test' ? process.env.TEST_DATABASE_URL! : EnvConfig.DATABASE_URL!
export const pool = new Pool({
    connectionString: DB_URL
})

export async function connectDB(retires = 5): Promise<void> {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connected");
    } catch (err: unknown) {
        if (retires === 0) throw err
        console.error("PostgreSQL connection failed", err);
        await new Promise((r) => setTimeout(r, 3000));
        return connectDB(retires - 1)
    }
}