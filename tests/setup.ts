import { pool } from "../src/common/db";

// Use this only in test DB, never prod

beforeEach(async () => {
    // await pool.query('DELETE FROM refresh_tokens');
    // await pool.query('DELETE FROM users');

    await pool.query(`
        TRUNCATE TABLE
        projects,
        workspace_members,
        workspaces,
        users
        RESTART IDENTITY CASCADE
  `);
});

