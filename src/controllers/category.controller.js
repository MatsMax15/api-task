import { request, response } from 'express'
import { errorResponse, successResponse } from '../helpers/responseHelper.js'
import { Category } from '../models/index.js'

export const getAll = async (req = request, res = response) => {
	try {
		const categories = await Category.findAll()

		return successResponse({
			res,
			message: 'Categories retrieved successfully',
			data: categories,
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}
