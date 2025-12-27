"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../common/db");
const env_1 = require("../config/env");
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, env_1.EnvConfig.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}
async function generateRefreshToken(userId) {
    const token = crypto.randomUUID();
    await db_1.pool.query(`
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '7 days')
        `, [userId, token]);
    return token;
}
