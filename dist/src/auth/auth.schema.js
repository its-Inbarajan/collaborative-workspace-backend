"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthSchema = void 0;
const zod_1 = require("zod");
exports.userAuthSchema = zod_1.z.object({
    email: zod_1.z.email().nonempty(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
