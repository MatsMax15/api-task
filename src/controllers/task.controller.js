import { response, request } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { Category, Task } from '../models/index.js'

import { errorResponse, successResponse } from '../helpers/responseHelper.js'
import { moveFile } from '../helpers/moveFileHelper.js'
import filesConfig from '../config/files.config.js'
import { Op } from 'sequelize'
import { fileExist } from '../helpers/fileExistHelper.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const create = async (req = request, res = response) => {
	try {
		const { categoryId, title, dateLimit, description, userId } = req.body

		const newTask = await Task.create({
			categoryId,
			title,
			description,
			userId,
			dateLimit,
		})

		const { fileName } = await moveFile({ file: req.file })

		newTask.file = fileName
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

export const update = async (req = request, res = response) => {
	try {
		const { id } = req.params
		const { categoryId, status, title, dateLimit, description } = req.body

		const task = await Task.findByPk(id)

		if (!task) {
			return errorResponse({
				res,
				status_code: 404,
				status_text: 'Bad Request',
				message: 'Task not found',
			})
		}

		task.categoryId = categoryId
		task.title = title
		task.status = status
		task.dateLimit = dateLimit
		task.description = description

		if (req.file && task.file) {
			const tasksPath = filesConfig.tasksPath
			const filePath = path.join(__dirname, '../..', tasksPath, task.file)

			const isFileExists = await fileExist(filePath)

			if (isFileExists) {
				await fs.unlink(filePath)
				console.log('Archivo eliminado:', filePath)
			}
		}

		const { fileName } = await moveFile({ file: req.file })
		task.file = fileName

		await task.save()

		return successResponse({
			res,
			status_code: 201,
			message: 'Task updated',
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
		const userId = req.user.id

		let { page = 1, perPage = 10, search } = req.query

		page = parseInt(page, 10) || 1
		perPage = parseInt(perPage, 10) || 10
		const offset = (page - 1) * perPage
		const limit = perPage

		const query = { userId }

		if (search) {
			query.title = { [Op.like]: `%${search}%` }
		}

		const { rows, count } = await Task.findAndCountAll({
			where: query,
			include: {
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
			order: [['dateLimit', 'ASC']],
			limit,
			offset,
		})

		const totalPages = Math.ceil(count / perPage)

		const links = [
			{
				rel: 'self',
				href: `?page=${page}&perPage=${perPage}`,
			},
			{
				rel: 'first',
				href: page > 1 ? `?page=1&perPage=${perPage}` : null,
			},
			{
				rel: 'last',
				href:
					page < totalPages ? `?page=${totalPages}&perPage=${perPage}` : null,
			},
			{
				rel: 'next',
				href: page < totalPages ? `?page=${page + 1}&perPage=${perPage}` : null,
			},
			{
				rel: 'prev',
				href: page > 1 ? `?page=${page - 1}&perPage=${perPage}` : null,
			},
		]

		const meta = {
			count,
			from: offset + 1,
			to: offset + rows.length,
			itemsPerPage: perPage,
			totalPages,
			currentPage: page,
		}

		const data = {
			meta,
			tasks: rows,
			links,
		}

		return successResponse({
			res,
			message: 'Access token generated',
			data,
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const getByStatus = async (req = request, res = response) => {
	try {
		const userId = req.user.id
		const { status } = req.params

		const tasks = await Task.findAll({
			where: { userId, status },
			include: {
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
		})

		return successResponse({
			res,
			status_code: 200,
			message: 'Tasks found by status',
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

export const getByCategory = async (req = request, res = response) => {
	try {
		const userId = req.user.id
		const { category } = req.params

		const tasks = await Task.findAll({
			where: { userId, categoryId: category },
			include: {
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
		})

		return successResponse({
			res,
			status_code: 200,
			message: 'Tasks found by category',
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
	try {
		const userId = req.user.id
		const { id } = req.params

		if (!id) {
			return errorResponse({
				res,
				status_code: 400,
				status_text: 'Bad Request',
				message: 'Task ID is required',
			})
		}

		const task = await Task.findOne({
			where: { id, userId },
			include: {
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
		})

		if (!task) {
			return errorResponse({
				res,
				status_code: 404,
				status_text: 'Bad Request',
				message: 'Task not found',
			})
		}

		return successResponse({
			res,
			status_code: 200,
			message: 'Task found',
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

export const downloadFile = async (req = request, res = response) => {
	try {
		const { id } = req.params

		const task = await Task.findByPk(id)

		if (!task || !task.file) {
			return errorResponse({
				res,
				status_code: 404,
				status_text: 'Bad Request',
				message: 'File not found',
			})
		}

		const tasksPath = filesConfig.tasksPath
		const filePath = path.join(__dirname, '../..', tasksPath, task.file)

		res.download(filePath, (err) => {
			console.log(err)

			if (err) {
				errorResponse({
					res,
					status_code: 404,
					status_text: 'Bad Request',
					message: 'File not found',
				})
			}
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const deleteFile = async (req = request, res = response) => {
	try {
		const { id } = req.params
		const task = await Task.findByPk(id)

		if (!task || !task.file) {
			return errorResponse({
				res,
				status_code: 404,
				status_text: 'Bad Request',
				message: 'File not found',
			})
		}

		const tasksPath = filesConfig.tasksPath
		const filePath = path.join(__dirname, '../..', tasksPath, task.file)

		await fs.unlink(filePath)
		console.log('Archivo eliminado:', filePath)

		task.file = null
		await task.save()

		return successResponse({
			res,
			status_code: 200,
			message: 'File deleted',
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const updateStatus = async (req = request, res = response) => {
	try {
		const userId = req.user.id
		const { id } = req.params
		const { status } = req.body

		const task = await Task.findByPk(id)

		if (!task) {
			return errorResponse({
				res,
				status_code: 404,
				status_text: 'Bad Request',
				message: 'Task not found',
			})
		}

		task.status = status
		await task.save()

		const tasks = await Task.findAll({
			where: { userId },
			include: {
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
		})

		return successResponse({
			res,
			status_code: 201,
			message: 'Task updated',
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

export const deleteTask = async (req = request, res = response) => {
	try {
		const { id } = req.params
		const task = await Task.findByPk(id)

		if (!task) {
			return errorResponse({
				res,
				status_code: 404,
				status_text: 'Bad Request',
				message: 'Task not found',
			})
		}

		if (task.file) {
			const tasksPath = filesConfig.tasksPath
			const filePath = path.join(__dirname, '../..', tasksPath, task.file)
			const isFileExists = await fileExist(filePath)

			if (isFileExists) {
				await fs.unlink(filePath)
				console.log('Archivo eliminado:', filePath)
			}
		}

		await task.destroy()

		return successResponse({
			res,
			status_code: 200,
			message: 'Task deleted',
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}
