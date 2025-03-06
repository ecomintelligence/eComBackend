/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './store.service'

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req?.body
    const result = await AuthServices.signup(userData)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Signup user successfully',
      data: result,
    })
  },
)

export const AuthControllers = {
    signup,
}