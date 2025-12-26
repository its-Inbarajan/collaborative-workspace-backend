import bcrypt from 'bcrypt';
import { AppConstants } from '../config/constant';
import * as authRepo from './auth.repository';
import { generateAccessToken, generateRefreshToken } from './auth.utils';
import { CustomError } from '../common/error.handler';

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