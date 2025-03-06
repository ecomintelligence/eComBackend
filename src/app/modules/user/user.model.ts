import mongoose, { Connection, Schema, SchemaType } from "mongoose";
import { IUser } from "./user.interface";

const UserModel = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    permission: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Permission",
    },
    store: { type: [Schema.Types.ObjectId], ref: "Store", required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const User = mongoose.model<IUser>("User", UserModel);

export const getUserModel = (tenantDbConnection: Connection) => {
  return (
    tenantDbConnection.models.User ||
    tenantDbConnection.model<IUser>("User", User.schema)
  );
};
