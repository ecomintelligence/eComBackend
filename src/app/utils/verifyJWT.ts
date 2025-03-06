/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from '../error/AppError'
// _id: user?._id,
//     name: user?.name,
//     email: user.email,
//     mobileNumber: user.mobileNumber,
//     role: user.role,
//     status: user.status,

export const createToken = (
  jwtPayload: any,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: "30d",
  })
}

export const verifyToken = (
  token: string,
  secret: string,
) => {
  try {
   const verify = jwt.verify(token, secret) as JwtPayload
    return jwt.verify(token, secret) as JwtPayload
  } catch (error: any) {
    throw new AppError(401, 'You are not authorized!')
  }
}