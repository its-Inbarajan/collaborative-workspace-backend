import { pool } from "../common/db";
import { executeJob } from "./job.executor";
import { enqueueJob } from "./job.queue";

async function handleJobFailure(jobId: string, error: string) {
    const { rows } = await pool.query(
        `SELECT attempts, max_attempts FROM jobs WHERE id = $1`,
        [jobId]
    );

    const job = rows[0];

    if (job.attempts >= job.max_attempts) {
        await pool.query(
            `
      UPDATE jobs
      SET status = 'FAILED',
          error = $2
      WHERE id = $1
      `,
            [jobId, error]
        );
    } else {
        // Requeue
        await enqueueJob(jobId);
    }
}


export async function processJob(jobId: string) {
    const { rows } = await pool.query(
        `
        SELECT * FROM jobs WHERE id = $1
        `,
        [jobId]
    )

    const job = rows[0];

    if (!job) return;

    // Idempotency check
    if (job.status === 'COMPLETED') {
        return;
    }

    if (job.attempts >= job.max_attempts) {
        return;
    }

    try {
        await pool.query(
            `
            UPDATE jobs
            SET status = 'PROCESSING'
                attempts = attempts + 1
            WHERE id = $1
            `,
            [jobId]
        )

        const result = await executeJob(job);

        await pool.query(
            `
      UPDATE jobs
      SET status = 'COMPLETED',
          result = $2
      WHERE id = $1
      `,
            [jobId, result]
        );
    } catch (error: unknown) {
        await handleJobFailure(jobId, (error as Error).message);
    }
}   