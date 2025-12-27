import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import { EnvConfig } from "../config/env";
import { isWorkspaceMember } from "../workspaces/workspace.repository";

export interface SocketUser {
    id: string;
    role: string;
}

export interface AuthenticatedSocket extends Socket {
    user: SocketUser;
}

export function authenticateSocket(
    socket: Socket,
    next: (err?: Error) => void
) {
    try {

        const token = socket.handshake.auth?.token;
        if (!token) throw new Error('Missing token');

        const payload = jwt.verify(token, EnvConfig.JWT_ACCESS_SECRET!) as SocketUser;

        (socket as AuthenticatedSocket).user = payload;
        next();
    } catch {
        next(new Error('Unauthorized'))
    }
}


export async function authorizeWorkspaceJoin(workspaceId: string, userId: string) {
    const allowed = await isWorkspaceMember(workspaceId, userId);
    if (!allowed) {
        throw new Error('Forbidden')
    }
}