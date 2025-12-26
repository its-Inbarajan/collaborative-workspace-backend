import express from "express";
import { authRouter } from "../src/auth/auth.routes";
import { GlobalError } from "../src/common/error.handler";
import { pool } from "../src/common/db";

export function createTestApp() {
    const app = express();

    app.use(express.json());
    app.use("/api/v1/auth", authRouter);

    app.use(GlobalError);

    return app;
}

export default async () => {
    await pool.end();
};
