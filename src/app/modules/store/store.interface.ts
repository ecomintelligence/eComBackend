import { Types } from "mongoose";

export interface IStore {
  name: string;
  user_id: Types.ObjectId; 
  status: StoreStatus;
  url?: string;
  add_on_domain?: string;
  categories?: string[];
  logo?: string;
  type?: string; 
}

export enum StoreStatus {
    active = "active",
    inactive = "inactive",
    delete = "delete"
}

