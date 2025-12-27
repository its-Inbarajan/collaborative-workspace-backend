"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const db_1 = require("./common/db");
const env_1 = require("./config/env");
const auth_routes_1 = require("./auth/auth.routes");
const error_handler_1 = require("./common/error.handler");
const ratelimit_1 = require("./common/ratelimit");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["POST", 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});
app.use('/api/v1/auth', auth_routes_1.authRouter);
app.use(ratelimit_1.globalRateLimit);
app.use(error_handler_1.GlobalError);
const io = new socket_io_1.Server(server, {
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
const PORT = env_1.EnvConfig.PORT;
async function start() {
    await (0, db_1.connectDB)();
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}
start();
