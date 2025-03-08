import { Router } from 'express'

import { verifyAccessToken } from '../middlewares/auth.middleware.js'
import { getAll } from '../controllers/category.controller.js'

const router = Router()

router.get('/', verifyAccessToken, getAll)

export default router
