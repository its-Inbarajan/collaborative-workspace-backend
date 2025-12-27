export interface UserPresenceEvent {
    userId: string;
    workspaceId: string;
}

export interface FileChangeEvent {
    workspaceId: string;
    projectId: string;
    payload: unknown;
}


export type CollaborationEvent =
    | {
        type: 'USER_JOINED';
        data: { userId: string; workspaceId: string };
    }
    | {
        type: 'USER_LEFT';
        data: { userId: string; workspaceId: string };
    }
    | {
        type: 'FILE_CHANGED';
        data: {
            workspaceId: string;
            projectId: string;
            payload: unknown;
        };
    }
    | {
        type: 'CURSOR_MOVED';
        data: {
            userId: string;
            workspaceId: string;
            x: number;
            y: number;
        };
    };
