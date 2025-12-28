import { AppConstants } from "../config/constant";
import { redisSubscriber } from "../redis/redis.client";
import { processJob } from "./job.processor";

const QUEUE = AppConstants.JOB_QUEUE

async function startWorker() {
    console.log('worker started');

    while (true) {
        const result = await redisSubscriber.brPop(QUEUE, 0);
        const jobId = result?.element;

        if (!jobId) continue;

        await processJob(jobId);
    }
}

startWorker()