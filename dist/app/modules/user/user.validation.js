"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
// Zod schema for ObjectId validation
const ObjectIdSchema = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
// Define Zod schema for User validation
exports.UserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    phone: zod_1.z.string().min(11, "Phone number must be at least 10 digits"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.string().optional(),
    permission: ObjectIdSchema.optional(),
    store: zod_1.z.array(ObjectIdSchema).optional(),
    status: zod_1.z.string().optional(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
});
