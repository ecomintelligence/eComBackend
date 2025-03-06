import  httpStatus  from 'http-status';
import bcrypt from "bcryptjs";
import config from "../../config";
import { User } from "../user/user.model";
import { Store } from "../store/store.model";
import mongoose from "mongoose";
import AppError from "../../error/AppError";
import { ILoginPayload, ISignupPayload } from './auth.interface';
import { createToken, verifyToken } from '../../utils/verifyJWT';
import { MasterDBUser } from '../tenanat/tennant.model';
import  { Schema, Document, Connection } from "mongoose";
import { IUser } from '../user/user.interface';
import { getTenantConnection } from '../../database/tenantDB';

// Tenant connection cache
const tenantConnections: { [key: string]: mongoose.Connection } = {};

// ✅ **একটি ফাংশন যা Tenant Connection থেকে Model তৈরি করবে**
const getUserModel = (tenantDbConnection: Connection) => {
  return tenantDbConnection.models.User || tenantDbConnection.model<IUser>("User", User.schema);
};


const signup = async (payload: ISignupPayload) => {
  const { email, name, phone, password, store_name } = payload;
  const tenantId = "tenant7"; 
  const tenantDbUri = `${config.db.base_db_url}/${tenantId}`;
await MasterDBUser.create({dbName: tenantId, userEmail: email})
  const tenantDbConnection = getTenantConnection(tenantId)

  // ✅ **Reuse existing User Schema for this tenant**
  const User = getUserModel(tenantDbConnection);

  // ✅ **Check if Users exist in this tenant DB**
  const users = await User.find();
  console.log("Existing Users in", tenantId, "DB:", users);

const newUser = await User.create({ email, name, phone, store_name, password });
console.log(newUser);
};


const login = async (payload: ILoginPayload) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  const matchPassword = bcrypt.compareSync(payload.password, user.password)

  //checking if the password is correct
  if (!matchPassword)
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

  //create token and sent to the  client
  const jwtPayload = {
    _id: user?._id.toString(),
    name: user?.name,
    email: user.email,
    role: user?.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expire_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expire_in as string,
  )
  return {
    accessToken,
    refreshToken,
  }
}

const createAccessToken = async (refreshToken: string) => {
const verify = verifyToken(refreshToken, config.jwt.jwt_refresh_secret || "default")
if(!verify){
  throw new AppError(httpStatus.CONFLICT, "Invalid token")
}
const jwtPayload = {
  _id: verify?._id,
  name: verify?.name,
  email: verify.email,
  role: verify?.role,
}
const accessToken = createToken(
  jwtPayload,
  config.jwt.jwt_access_secret as string,
  config.jwt.jwt_access_expire_in as string,
)
return {accessToken}
}

export const AuthServices = {
  signup,
  login,
  createAccessToken
};
