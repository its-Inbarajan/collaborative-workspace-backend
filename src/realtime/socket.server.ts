import * as http from 'http';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './socket.types';
import { registerSocketHandlers } from './socket.handlers';
import { CollaborationService } from '../collaboration/collaboration.service';
import { AuthenticatedSocket, authenticateSocket } from './socket.auth';
import { connectRedis } from '../redis/redis.client';
import { subscribeToCollaborationEvents } from '../collaboration/collaboration.subscriber';

export async function createSocketServer(httpServer: http.Server) {
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents
    >(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.use(authenticateSocket);

    const collaborationService = new CollaborationService(io);

    io.on('connection', (socket) => {
        registerSocketHandlers(socket as AuthenticatedSocket, collaborationService);
    });
    await connectRedis();

    await subscribeToCollaborationEvents(collaborationService);

    return io;
}
