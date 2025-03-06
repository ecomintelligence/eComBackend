"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDBUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const masterDBUserSchema = new mongoose_1.default.Schema({
    dbName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true }, // Store user email or other details
}, {
    timestamps: true
});
exports.MasterDBUser = mongoose_1.default.model('master_db_user', masterDBUserSchema);
