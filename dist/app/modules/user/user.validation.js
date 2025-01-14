"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userZodSchema = void 0;
const zod_1 = require("zod");
exports.userZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            email: zod_1.z.string({
                required_error: 'Email is required !',
            }),
            password: zod_1.z.string({
                required_error: 'Password is required !',
            }),
        }),
    }),
});
