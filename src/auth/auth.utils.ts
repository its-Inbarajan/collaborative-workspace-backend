import jwt from 'jsonwebtoken';
import { pool } from '../common/db';
import { EnvConfig } from '../config/env';

export function generateAccessToken(user: { id: string; role: string }) {
    return jwt.sign(
        { id: user.id, role: user.role },
        EnvConfig.JWT_ACCESS_SECRET!,
        { expiresIn: '15m' }
    );
}

export async function generateRefreshToken(userId: string) {
    const token = crypto.randomUUID();

    await pool.query(
        `
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '7 days')
        `,
        [userId, token]
    );

    return token;
}
