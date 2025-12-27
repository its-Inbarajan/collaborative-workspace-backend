"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.connectDB = connectDB;
const pg_1 = require("pg");
const env_1 = require("../config/env");
exports.pool = new pg_1.Pool({
    connectionString: env_1.EnvConfig.DATABASE_URL
});
async function connectDB() {
    try {
        await exports.pool.query("SELECT 1");
        console.log("PostgreSQL connected");
    }
    catch (err) {
        console.error("PostgreSQL connection failed", err);
        process.exit(1);
    }
}
