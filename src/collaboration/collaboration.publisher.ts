import { redisPublisher } from "../redis/redis.client";
import { CollaborationEvent } from "./collaboration.types";

const CHANNEL = 'collaboration-events';

export async function publishCollaborationEvent(
    event: CollaborationEvent
) {
    await redisPublisher.publish(
        CHANNEL,
        JSON.stringify(event)
    );
}