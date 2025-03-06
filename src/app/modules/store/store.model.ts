import mongoose, { Schema } from "mongoose";
import { IStore, StoreStatus } from "./store.interface";

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: Object.values(StoreStatus), default: StoreStatus.active },
    url: { type: String },
    add_on_domain: { type: String },
    categories: { type: [String] },
    logo: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

export const Store = mongoose.model<IStore>("Store", StoreSchema);
