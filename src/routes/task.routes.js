import { Router } from 'express'

import { getAll, create, getById } from '../controllers/task.controller.js'
import { verifyAccessToken } from '../middlewares/auth.middleware.js'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import { taskValidator } from '../middlewares/validate.middleware.js'

const router = Router()

router.get('/', verifyAccessToken, getAll)
router.post('/', verifyAccessToken, uploadMiddleware, taskValidator, create)
router.get('/:id', verifyAccessToken, getById)

export default router
