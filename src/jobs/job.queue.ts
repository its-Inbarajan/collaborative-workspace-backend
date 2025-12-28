import { AppConstants } from "../config/constant";
import { redisPublisher } from "../redis/redis.client";

const QUEUE = AppConstants.JOB_QUEUE;


export async function enqueueJob(jobId: string) {
    if (!jobId) {
        throw new Error('enqueueJob called without jobId');
    }
    return await redisPublisher.lPush(QUEUE, jobId)
}