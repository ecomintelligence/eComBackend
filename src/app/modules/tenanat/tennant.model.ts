import mongoose from "mongoose";

const masterDBUserSchema = new mongoose.Schema({
    dbName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true }, // Store user email or other details
}, {
    timestamps: true
});
export const MasterDBUser = mongoose.model('master_db_user', masterDBUserSchema);