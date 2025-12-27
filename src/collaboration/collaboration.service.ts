import { Server } from 'socket.io';
export class CollaborationService {
    constructor(private readonly io: Server) { }

    // Socket emitters (local only)
    emitUserJoined(data: { userId: string; workspaceId: string }) {
        this.io.to(data.workspaceId).emit('workspace:user-joined', data);
    }

    emitUserLeft(data: { userId: string; workspaceId: string }) {
        this.io.to(data.workspaceId).emit('workspace:user-left', data);
    }

    emitFileChanged(data: {
        workspaceId: string;
        projectId: string;
        payload: unknown;
    }) {
        this.io.to(data.workspaceId).emit('project:file-changed', data);
    }

    emitCursorMoved(data: {
        userId: string;
        workspaceId: string;
        x: number;
        y: number;
    }) {
        this.io.to(data.workspaceId).emit('presence:cursor', data);
    }
}
