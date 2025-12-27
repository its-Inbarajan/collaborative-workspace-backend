"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = createTestApp;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../src/auth/auth.routes");
const error_handler_1 = require("../src/common/error.handler");
const db_1 = require("../src/common/db");
function createTestApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/v1/auth", auth_routes_1.authRouter);
    app.use(error_handler_1.GlobalError);
    return app;
}
exports.default = async () => {
    await db_1.pool.end();
};
