import express from 'express'
import { AuthControllers } from './store.controller'
const router = express.Router()

router.post('/signup', AuthControllers.signup)

export const AuthRouter = router