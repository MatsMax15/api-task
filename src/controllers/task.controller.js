import { response, request } from 'express'
import fs from 'fs'
import path from 'path'

import { Task } from '../models/index.js'

import { errorResponse, successResponse } from '../helpers/responseHelper.js'

export const create = async (req = request, res = response) => {
	try {
		const { categoryId, title, description, userId } = req.body
		const file = req.file ? req.file.filename : null

		const newTask = await Task.create({
			categoryId,
			title,
			description,
			userId,
			file,
		})

		const uploadDir = path.join('./public/assets/uploads/', 'tasks')
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true })
		}

		const filePath = path.join(
			uploadDir,
			Date.now() + path.extname(req.file.originalname)
		)

		fs.writeFileSync(filePath, req.file.buffer)

		const pathDb = path.join(
			'assets/uploads/tasks',
			Date.now() + path.extname(req.file.originalname)
		)

		newTask.file = pathDb
		const task = await newTask.save()

		return successResponse({
			res,
			status_code: 201,
			message: 'Task created',
			data: task,
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const getAll = async (req = request, res = response) => {
	try {
		const { limit = 10, page = 1, q } = req.query

		const query = {}
		if (q) {
			query.name = { $regex: q, $options: 'i' }
		}

		const tasks = await Task.findAll({
			where: query,
			limit,
			offset: limit * (page - 1),
		})

		return successResponse({
			res,
			message: 'Access token generated',
			data: tasks,
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const getById = async (req = request, res = response) => {
	const { id } = req.params

	res.json({
		message: 'Hello World',
		id,
	})
}

// ...existing code...
