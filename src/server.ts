import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './common/db';
import { EnvConfig } from './config/env';
import { authRouter } from './auth/auth.routes';
import { GlobalError } from './common/error.handler';
import { globalRateLimit } from './common/ratelimit';
import workspaceRouter from './workspaces/workspace.routes';
import { join } from 'path';
import { createSocketServer } from './realtime/socket.server';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin: "*",
    methods: ["POST", 'GET', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));


app.get("/", (_, res) => {
    res.sendFile(join(__dirname, "/view/index.html"));
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/workspace', workspaceRouter);

app.use(globalRateLimit)
app.use(GlobalError)

const PORT = EnvConfig.PORT;

createSocketServer(httpServer);

async function start() {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}

start();