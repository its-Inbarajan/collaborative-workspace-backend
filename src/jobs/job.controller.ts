import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';
import { pool } from "../common/db";
import { enqueueJob } from "./job.queue";

export async function createJob(req: Request, res: Response) {
    const jobId = uuid();

    await pool.query(
        `
        INSERT INTO jobs (id, type, payload, status)
        VALUES ($1, $2, $3, 'PENDING')
        `,
        [jobId, req.body.type, req.body.payload]
    )
    await enqueueJob(jobId);
    res.status(202).json({
        jobId,
        status: "PENDING"
    })
}