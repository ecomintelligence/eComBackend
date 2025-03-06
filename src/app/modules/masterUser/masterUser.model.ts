import mongoose from "mongoose";

const masterDBUserSchema = new mongoose.Schema({
    dbName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true }, 
}, {
    timestamps: true
});
export const MasterDBUser = mongoose.model('master_user', masterDBUserSchema);