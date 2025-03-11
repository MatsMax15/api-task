import { Router } from 'express'

import {
	getAll,
	create,
	getById,
	downloadFile,
	updateStatus,
	getByStatus,
	getByCategory,
	deleteFile,
	update,
	deleteTask,
} from '../controllers/task.controller.js'
import { verifyAccessToken } from '../middlewares/auth.middleware.js'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import {
	taskStatusValidator,
	taskValidator,
} from '../middlewares/validate.middleware.js'

const router = Router()

router.get('/', verifyAccessToken, getAll)
router.get('/:id', verifyAccessToken, getById)
router.get('/:id/download', verifyAccessToken, downloadFile)
router.get('/:id/delete', verifyAccessToken, deleteFile)
router.get('/status/:status', verifyAccessToken, getByStatus)
router.get('/category/:category', verifyAccessToken, getByCategory)

router.post('/', verifyAccessToken, uploadMiddleware, taskValidator, create)
router.put('/:id', verifyAccessToken, uploadMiddleware, taskValidator, update)
router.patch('/:id', verifyAccessToken, taskStatusValidator, updateStatus)
router.delete('/:id', verifyAccessToken, deleteTask)

export default router

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Endpoints de gestión de tareas
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtiene todas las tareas del usuario autenticado
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Cantidad de tareas por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por título de la tarea
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtiene los detalles de una tarea específica
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Detalles de la tarea
 *       404:
 *         description: Tarea no encontrada
 */

/**
 * @swagger
 * /api/tasks/{id}/download:
 *   get:
 *     summary: Descarga el archivo adjunto de una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Archivo descargado
 *       404:
 *         description: Archivo no encontrado
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               dateLimit:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               dateLimit:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *       404:
 *         description: Tarea no encontrada
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada
 *       404:
 *         description: Tarea no encontrada
 */
