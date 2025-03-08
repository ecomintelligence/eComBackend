import { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  permission?: Types.ObjectId;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
