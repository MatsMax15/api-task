import { Router } from 'express'

import {
	login,
	logout,
	refresh,
	signup,
} from '../controllers/auth.controller.js'

import { verifyRefreshToken } from '../middlewares/auth.middleware.js'
import {
	signupValidator,
	loginValidator,
} from '../middlewares/validate.middleware.js'

const router = Router()

router.post('/signup', signupValidator, signup)
router.post('/login', loginValidator, login)
router.get('/logout', logout)

router.get('/refresh', verifyRefreshToken, refresh)

export default router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example:
 *                 success: true
 *                 status_code: 200
 *                 status_text: OK
 *                 message: User created
 *                 data: { user, refreshToken }
 *       400:
 *         description: Validation error
 *         content:
 *          application/json:
 *           schema:
 *             type: string
 *             example:
 *              success: false
 *              status_code: 400
 *              status_text: Bad Request
 *              message: Validation error
 *              errors: [errors.array()]
 *       500:
 *        description: Server Error
 *        content:
 *         application/json:
 *          schema:
 *            type: string
 *            example:
 *             success: false
 *             status_code: 500
 *             status_text: Server Error
 *             message: err.message
 *             errors: null
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Cierra sesión del usuario
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     summary: Refresca el token de acceso
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refrescado
 *       401:
 *         description: Token inválido o expirado
 */
