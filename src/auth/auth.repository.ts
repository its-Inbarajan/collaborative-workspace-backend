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

export async function createOAuthUser(data: { email: string, provider: string, providerId: string }) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create user
        const userResult = await client.query(
            `
            INSERT INTO users (email)
            VALUES ($1)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, email, role
        `,
            [data.email]
        );

        let user = userResult.rows[0];

        // 2. If user already existed, fetch it
        if (!user) {
            const existingUser = await client.query(
                `SELECT id, email, role FROM users WHERE email = $1`,
                [data.email]
            );
            user = existingUser.rows[0];
        }

        // 3. Create OAuth mapping
        await client.query(
            `
            INSERT INTO user_oauth_accounts (user_id, provider, provider_user_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (provider, provider_user_id) DO NOTHING
          `,
            [user.id, data.provider, data.providerId]
        );

        await client.query('COMMIT');
        return user;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}