import express from 'express'
import { AuthControllers } from './auth.controller'
const router = express.Router()

router.post('/signup', AuthControllers.signup)
router.post('/login', AuthControllers.login)
router.post('/create-access-token', AuthControllers.createAccessToken)

export const AuthRouter = router