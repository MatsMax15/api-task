import { request, response } from 'express'

import bcrypt from 'bcryptjs'
import { User, Token } from '../models/index.js'
import { generateAccess, generateRefresh } from '../helpers/tokenHelper.js'
import { errorResponse, successResponse } from '../helpers/responseHelper.js'
import { setCookie } from '../helpers/cookieHelper.js'

export const signup = async (req = request, res = response) => {
	const { name, email, password } = req.body

	try {
		const hash = bcrypt.hashSync(password)

		const newUser = await User.create({
			name,
			email,
			password: hash,
		})

		const { refreshToken, expiresIn } = generateRefresh({ id: newUser.id })

		await Token.create({
			token: refreshToken,
			userId: newUser.id,
			expiresIn: new Date(Date.now() + expiresIn),
		})

		setCookie({ res, refreshToken, expiresIn })

		const user = await newUser.reload()

		return successResponse({
			res,
			message: 'User created',
			data: { user, refreshToken },
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const login = async (req = request, res = response) => {
	const { email, password } = req.body

	try {
		const checkUser = await User.scope('withPassword').findOne({
			where: { email },
		})

		if (!bcrypt.compareSync(password, checkUser.password)) {
			return errorResponse({
				res,
				status_code: 401,
				status_text: 'Bad Request',
				message: 'Invalid credentials',
			})
		}

		const { refreshToken, expiresIn } = generateRefresh({ id: checkUser.id })

		await Token.create({
			token: refreshToken,
			userId: checkUser.id,
			expiresIn: new Date(Date.now() + expiresIn),
		})

		setCookie({ res, refreshToken, expiresIn })

		const user = await User.findOne({ where: { email } })

		return successResponse({
			res,
			message: 'User logged in',
			data: { user, refreshToken },
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}

export const refresh = async (req = request, res = response) => {
	const { refreshToken } = req.cookies

	try {
		const token = await Token.findOne({ where: { token: refreshToken } })

		if (!token) {
			return errorResponse({
				res,
				status_code: 401,
				status_text: 'Unauthorized',
				message: 'Invalid token',
			})
		}

		const { accessToken } = generateAccess({ id: token.userId })

		return successResponse({
			res,
			message: 'Access token generated',
			data: { accessToken },
		})
	} catch (err) {
		return errorResponse({
			res,
			message: err.message,
			status_code: 500,
		})
	}
}
