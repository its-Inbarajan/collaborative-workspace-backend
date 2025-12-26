import { pool } from "../src/common/db";


beforeEach(async () => {
    await pool.query('DELETE FROM refresh_tokens');
    await pool.query('DELETE FROM users');
});

