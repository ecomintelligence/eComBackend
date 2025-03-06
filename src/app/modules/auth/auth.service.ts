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

// const tenantIdToConnection: any = {};
// const signup = async (payload: ISignupPayload) => {
//   const { email, name } = payload;

//   const createMasterDB = await MasterDBUser.create({
//     tenantId: "tenant123",
//     dbName: "tenant123DB",
//     userEmail: "user@example.com",
//   }
//   )
//   mongoose.createConnection(`${config.db.base_db_url}/tenant1`)

//   const session = await mongoose.startSession();
//   session.startTransaction(); 
//   const findUser = await User.findOne({email: payload.email})

//   if(findUser?.email){
//     throw new AppError(httpStatus.CONFLICT, 'This user is already exist!')
//   }

//   try {
//     const { store_name, password, ...userData } = payload;

//     const salt = bcrypt.genSaltSync(Number(config.password_salt_round as string));
//     const hash = bcrypt.hashSync(password, salt);

//     const signupData = {
//       ...userData,
//       password: hash,
//     };

//     // Create User inside the transaction
//     const createUser = await User.create([signupData], { session });

//     const storeData = {
//       name: store_name,
//       user_id: createUser[0]._id,
//     };

//     // Create Store inside the transaction
//     const createStore = await Store.create([storeData], { session });

//     // Commit transaction (save changes)
//     await session.commitTransaction();
//     session.endSession();

//     // Return final response without password
//     return {
//       _id: createUser[0]._id,
//       store_id: createStore[0]._id,
//       name: createUser[0].name,
//       email: createUser[0].email,
//       phone: createUser[0].phone,
//       role: createUser[0].role,
//       permission: createUser[0].permission,
//       store: createUser[0].status,
//       createdAt: createUser[0].createdAt,
//       updatedAt: createUser[0].updatedAt,
//     };
//   } catch (error) {
//     // Rollback transaction if anything fails
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Signup failed, please try again.");
//   }
// };



import  { Schema, Document, Connection } from "mongoose";
import { IUser } from '../user/user.interface';
import { getTenantConnection, getTenantModel } from '../../database/tenantDB';

// Tenant connection cache
const tenantConnections: { [key: string]: mongoose.Connection } = {};

// ✅ **একটি ফাংশন যা Tenant Connection থেকে Model তৈরি করবে**
const getUserModel = (tenantDbConnection: Connection) => {
  return tenantDbConnection.models.User || tenantDbConnection.model<IUser>("User", User.schema);
};


const signup = async (payload: { email: string; name: string,  }) => {
  const { email, name, phone, password, store_name } = payload;
  const tenantId = "tenant6"; // এটি ডাইনামিক করতে পারেন
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
