import { Router } from 'express'

import { login, refresh, signup } from '../controllers/auth.controller.js'

import { verifyRefreshToken } from '../middlewares/auth.middleware.js'
import {
	signupValidator,
	loginValidator,
} from '../middlewares/validate.middleware.js'

const router = Router()

router.post('/signup', signupValidator, signup)
router.post('/login', loginValidator, login)

router.get('/refresh', verifyRefreshToken, refresh)

export default router
