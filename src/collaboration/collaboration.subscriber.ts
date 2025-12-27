import { redisSubscriber } from "../redis/redis.client";
import { CollaborationService } from "./collaboration.service";
import { CollaborationEvent } from "./collaboration.types";

const CHANNEL = 'collaboration-events';

export async function subscribeToCollaborationEvents(service: CollaborationService) {
    await redisSubscriber.subscribe(CHANNEL, (message) => {
        const event = JSON.parse(message) as CollaborationEvent

        switch (event.type) {
            case 'USER_JOINED':
                service.emitUserJoined(event.data);
                break;

            case 'USER_LEFT':
                service.emitUserLeft(event.data);
                break;

            case 'FILE_CHANGED':
                service.emitFileChanged(event.data);
                break;

            case 'CURSOR_MOVED':
                service.emitCursorMoved(event.data);
                break;
        }
    })
}