import { pool } from "../common/db";

export async function createUser(email: string, hashedPassword: string) {
    const result = await pool.query(
        `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email, role
    `,
        [email, hashedPassword]
    );

    return result.rows[0];
}

export async function findUserByEmail(email: string) {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    return result.rows[0];
}

export async function findUserWithPassword(email: string) {
    const result = await pool.query(`
            SELECT id, email, password, role
            FROM users
            WHERE email = $1`,
        [email]
    )

    return result.rows[0]
}


export async function findUserById(userId: string) {
    const result = await pool.query(`
        SELECT id, email, role, created_at
        FROM users
        WHERE id = $1    
        `,
        [userId]
    )

    return result.rows[0]
}