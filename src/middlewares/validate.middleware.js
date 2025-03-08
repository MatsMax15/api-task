import { body, validationResult } from 'express-validator'
import { categoryExists, userExists } from '../helpers/validatorDBHelper.js'
import { errorResponse } from '../helpers/responseHelper.js'

export const validatorResult = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return errorResponse({
			res,
			status_code: 400,
			status_text: 'Bad Request',
			message: 'Validation error',
			errorDetails: errors.array(),
		})
	}

	next()
}

export const signupValidator = [
	body('name', 'Name is not valid')
		.trim()
		.exists()
		.isString()
		.isLength({ min: 3 }),
	body('email', 'Email is not valid')
		.trim()
		.exists()
		.isEmail()
		.normalizeEmail(),
	body('password', 'Password is not valid').exists().isLength({ min: 6 }),
	body('email').custom(async (value) => {
		const user = await userExists({ field: 'email', value })

		if (user) {
			throw new Error(`The email ${value} already exists`)
		}
	}),
	validatorResult,
]

export const loginValidator = [
	body('email', 'Email is not valid')
		.trim()
		.exists()
		.isEmail()
		.normalizeEmail(),
	body('password', 'Password is not valid')
		.trim()
		.exists()
		.isLength({ min: 6 }),
	body('email').custom(async (value) => {
		const user = await userExists({ field: 'email', value })

		if (!user) {
			throw new Error('Credentials are not valid')
		}
	}),
	validatorResult,
]

export const taskValidator = [
	body('title', 'Title is not valid')
		.trim()
		.exists()
		.isString()
		.isLength({ min: 3 }),
	body('description', 'Description is not valid')
		.trim()
		.exists()
		.isString()
		.isLength({ min: 3 }),
	body('categoryId', 'Category is not valid').trim().exists().isNumeric(),
	body('categoryId').custom(async (value) => {
		const category = await categoryExists({ id: value })

		if (!category) {
			throw new Error('Category is not valid')
		}
	}),
	body('userId', 'User is not valid').trim().exists().isUUID(),
	body('userId').custom(async (value) => {
		const user = await userExists({ field: 'id', value })

		if (!user) {
			throw new Error('User is not valid')
		}
	}),
	validatorResult,
]
