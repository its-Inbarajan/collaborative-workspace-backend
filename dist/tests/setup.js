"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../src/common/db");
beforeEach(async () => {
    await db_1.pool.query('DELETE FROM refresh_tokens');
    await db_1.pool.query('DELETE FROM users');
});
