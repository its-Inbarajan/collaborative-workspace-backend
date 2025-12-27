export interface ClientToServerEvents {
    'workspace:join': (data: { workspaceId: string }) => void;
    'workspace:leave': (data: { workspaceId: string }) => void;

    'project:file-change': (data: {
        workspaceId: string;
        projectId: string;
        payload: unknown; // mocked
    }) => void;

    'presence:cursor': (data: {
        workspaceId: string;
        x: number;
        y: number;
    }) => void;
}

export interface ServerToClientEvents {
    'workspace:user-joined': (data: {
        userId: string;
        workspaceId: string;
    }) => void;

    'workspace:user-left': (data: {
        userId: string;
        workspaceId: string;
    }) => void;

    'project:file-changed': (data: {
        workspaceId: string;
        projectId: string;
        payload: unknown;
    }) => void;

    'presence:cursor': (data: {
        userId: string;
        workspaceId: string;
        x: number;
        y: number;
    }) => void;
}


// export interface ClientToServerEvents {
//     'workspace:join': (data: { workspaceId: string }) => Promise<void | boolean>;
//     "workspace:leave": (data: { workspaceId: string }) => void;
//     "project:file-change": (data: {
//         workspaceId: string;
//         projectId: string;
//         payload: unknown; // mocked
//     }) => void
//     "presence:cursor": (data: {
//         workspaceId: string;
//         x: number;
//         y: number;
//     }) => void
//     error: (message: string) => void
// }

// export interface ServerToClientEvents {
//     "workspace:user-joined": (data: { userId: string; workspaceId: string }) => void;
//     "workspace:user-left": (data: {
//         userId: string;
//         workspaceId: string;
//     }) => void;
//     "project:file-changed": (data: {
//         userId: string;
//         projectId: string
//         payload: unknown
//     }) => void
//     "presence:cursor-updated": (data: {
//         userId: string;
//         x: number;
//         y: number;
//     }) => void;
//     error: (data: { message: string }) => void
// }
