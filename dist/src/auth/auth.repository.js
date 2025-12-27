"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserWithPassword = findUserWithPassword;
exports.findUserById = findUserById;
exports.createOAuthUser = createOAuthUser;
const db_1 = require("../common/db");
async function createUser(email, hashedPassword) {
    const result = await db_1.pool.query(`
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email, role
    `, [email, hashedPassword]);
    return result.rows[0];
}
async function findUserByEmail(email) {
    const result = await db_1.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
}
async function findUserWithPassword(email) {
    const result = await db_1.pool.query(`
            SELECT id, email, password, role
            FROM users
            WHERE email = $1`, [email]);
    return result.rows[0];
}
async function findUserById(userId) {
    const result = await db_1.pool.query(`
        SELECT id, email, role, created_at
        FROM users
        WHERE id = $1    
        `, [userId]);
    return result.rows[0];
}
async function createOAuthUser(data) {
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        // 1. Create user
        const userResult = await client.query(`
            INSERT INTO users (email)
            VALUES ($1)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, email, role
        `, [data.email]);
        let user = userResult.rows[0];
        // 2. If user already existed, fetch it
        if (!user) {
            const existingUser = await client.query(`SELECT id, email, role FROM users WHERE email = $1`, [data.email]);
            user = existingUser.rows[0];
        }
        // 3. Create OAuth mapping
        await client.query(`
            INSERT INTO user_oauth_accounts (user_id, provider, provider_user_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (provider, provider_user_id) DO NOTHING
          `, [user.id, data.provider, data.providerId]);
        await client.query('COMMIT');
        return user;
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}
