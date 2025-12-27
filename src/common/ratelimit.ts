import rateLimit from 'express-rate-limit';

// Global Rate Limiter (Public APIs)
export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
})

// Strict Rate limiter (Auth APIs)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many authentication attempts. Try later.',
    },
});
