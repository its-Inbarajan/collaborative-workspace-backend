import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { connectDB } from './common/db';
import { EnvConfig } from './config/env';
import { authRouter } from './auth/auth.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "*",
    methods: ["POST", 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));


app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});

app.use('/api/v1', authRouter)

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});


const PORT = EnvConfig.PORT;

async function start() {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

start();