"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const teardown_1 = require("../teardown");
const app = (0, teardown_1.createTestApp)();
describe('Auth Apis', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    // Register Api
    describe('POST /api/v1/auth/register', () => {
        it('registers a new user', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({
                email: 'test@example.com',
                password: 'Password123!',
            });
            expect(res.status).toBe(201);
            expect(res.body.data.user.email).toBe('test@example.com');
        });
        it('fails if email already exists', async () => {
            await (0, supertest_1.default)(app).post('/api/v1/auth/register').send({
                email: 'duplicate@example.com',
                password: 'Password123!',
            });
            const res = await (0, supertest_1.default)(app).post('/api/v1/auth/register').send({
                email: 'duplicate@example.com',
                password: 'Password123!',
            });
            expect(res.status).toBe(409);
        });
    });
    // Login Api
    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app).post('/api/v1/auth/register').send({
                email: 'login@test.com',
                password: 'Password123!',
            });
        });
        it('logs in with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send({
                email: 'login@test.com',
                password: 'Password123!',
            });
            expect(res.status).toBe(200);
            expect(res.body.data.tokens.accessToken).toBeDefined();
        });
        it('should reject if login with invalid credentials', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send({
                email: "login@test.com",
                password: 'worng!'
            });
            expect(res.status).toBe(401);
        });
        it('returns zodError 400 for invalid password length', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send({
                email: 'login@test.com',
                password: '12345',
            });
            expect(res.status).toBe(400);
        });
    });
    describe('GET /api/v1/auth/me', () => {
        let accessToken;
        beforeEach(async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({
                email: 'me@test.com',
                password: 'Password123!',
            });
            accessToken = res.body.data.tokens.accessToken;
        });
        it('returns current user when authenticated', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`);
            console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body.data.email).toBe('me@test.com');
        });
        it('rejects unauthenticated request', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/v1/auth/me');
            expect(res.status).toBe(401);
        });
    });
});
