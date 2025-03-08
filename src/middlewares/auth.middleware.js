import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.config.js'
import { errorResponse } from '../helpers/responseHelper.js'

export const verifyRefreshToken = (req, res, next) => {
	try {
		const refreshToken = req.cookies.refreshToken

		if (!refreshToken) {
			return errorResponse({
				res,
				status_code: 401,
				status_text: 'Unauthorized',
				message: 'Token not found',
			})
		}

		jwt.verify(refreshToken, jwtConfig.refresh_secret, (err, decoded) => {
			if (err) {
				return errorResponse({
					res,
					status_code: 401,
					status_text: 'Unauthorized',
					message: 'Invalid token',
				})
			}

			next()
		})
	} catch (error) {
		return errorResponse({
			res,
			status_code: 401,
			status_text: 'Unauthorized',
			message: 'Token not found',
		})
	}
}

export const verifyAccessToken = (req, res, next) => {
	const authHeader = req.headers.authorization
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return errorResponse({
			res,
			status_code: 401,
			status_text: 'Unauthorized',
			message: 'Token not found',
		})
	}

	jwt.verify(token, jwtConfig.access_secret, (err, decoded) => {
		if (err) {
			return errorResponse({
				res,
				status_code: 401,
				status_text: 'Unauthorized',
				message: 'Invalid token',
			})
		}

		req.user = decoded
		next()
	})
}
