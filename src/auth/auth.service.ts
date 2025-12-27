import bcrypt from 'bcrypt';
import { AppConstants } from '../config/constant';
import * as authRepo from './auth.repository';
import { generateAccessToken, generateRefreshToken } from './auth.utils';
import { CustomError } from '../common/error.handler';
import { pool } from '../common/db';

export async function register(email: string, password: string) {
    const existingUser = await authRepo.findUserByEmail(email);
    if (existingUser) {
        throw new CustomError('EMAIL_ALREADY_EXISTS', 409);
    }

    const hashedPassword = await bcrypt.hash(
        password,
        AppConstants.SALT_ROUNDS
    );

    const user = await authRepo.createUser(email, hashedPassword);

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    return {
        user,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}

export async function login(email: string, password: string) {
    const user = await authRepo.findUserWithPassword(email);

    if (!user) {
        throw new CustomError('User not found.', 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new CustomError('Password mismatch.', 401);
    }

    const accessToken = generateAccessToken({
        id: user.id,
        role: user.role,
    });

    const refreshToken = await generateRefreshToken(user.id);
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}

export async function getMe(userId: string) {
    const user = await authRepo.findUserById(userId);
    if (!user) {
        throw new CustomError('USER_NOT_FOUND', 404)
    }

    return user
}

export async function refreshToken(refreshToken: string) {
    const result = await pool.query(
        `
        SELECT * FROM refresh_token
        WHERE token = $1 AND revoked = false AND expires_at > NOW() 
        `,
        [refreshToken]
    )

    const storedToken = result.rows[0];
    if (!storedToken) {
        throw new CustomError('Invalid refresh token', 401);
    }

    await pool.query(
        `UPDATE refresh_tokens SET revoked = true WHERE id = $1`,
        [storedToken.id]
    );

    const newRefreshToken = await generateRefreshToken(storedToken.user_id);
    const accessToken = generateAccessToken({ id: storedToken.user_id, role: storedToken.role });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
}