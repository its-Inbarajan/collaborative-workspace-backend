
import {
    joinWorkspaceSchema,
    leaveWorkspaceSchema,
    fileChangeSchema,
    cursorSchema,
} from './socket.schema';
import { CollaborationService } from '../collaboration/collaboration.service';
import { AuthenticatedSocket } from './socket.auth';
import { publishCollaborationEvent } from '../collaboration/collaboration.publisher';

export function registerSocketHandlers(
    socket: AuthenticatedSocket,
    _collaborationService: CollaborationService
) {
    const joinedWorkspaces = new Set<string>();
    const { user } = socket;

    socket.on('workspace:join', async (payload) => {
        const parsed = joinWorkspaceSchema.safeParse(payload);
        if (!parsed.success) return;
        const { workspaceId } = parsed.data;

        // Local-only operation
        socket.join(workspaceId);
        joinedWorkspaces.add(workspaceId);

        // Local-only operation
        await publishCollaborationEvent({
            type: 'USER_JOINED',
            data: {
                userId: user.id,
                workspaceId,
            },
        });
    });

    socket.on('workspace:leave', async (payload) => {
        const parsed = leaveWorkspaceSchema.safeParse(payload);
        if (!parsed.success) return;

        const { workspaceId } = parsed.data;

        socket.leave(workspaceId);
        joinedWorkspaces.delete(workspaceId);

        await publishCollaborationEvent({
            type: 'USER_LEFT',
            data: {
                userId: user.id,
                workspaceId,
            },
        });
    });

    socket.on('project:file-change', async (payload) => {
        const parsed = fileChangeSchema.safeParse(payload);
        if (!parsed.success) return;

        await publishCollaborationEvent({
            type: 'FILE_CHANGED',
            data: parsed.data
        });
    });

    socket.on('presence:cursor', async (payload) => {
        const parsed = cursorSchema.safeParse(payload);
        if (!parsed.success) return;


        await publishCollaborationEvent({
            type: 'CURSOR_MOVED',
            data: {
                userId: user.id,
                workspaceId: parsed.data.workspaceId,
                x: parsed.data.x,
                y: parsed.data.y
            }
        });
    });

    socket.on('disconnect', async () => {
        for (const workspaceId of joinedWorkspaces) {
            await publishCollaborationEvent({
                type: 'USER_LEFT',
                data: {
                    userId: user.id,
                    workspaceId,
                },
            });
        }
    });
}
