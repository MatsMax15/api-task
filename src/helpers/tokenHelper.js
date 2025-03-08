import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.config.js'

export const generateRefresh = ({ id }) => {
	try {
		const expiresIn = jwtConfig.refresh_expiresIn

		const refreshToken = jwt.sign({ id }, jwtConfig.refresh_secret, {
			expiresIn,
		})

		return { refreshToken, expiresIn }
	} catch (error) {
		console.log(error)
		return null
	}
}

export const generateAccess = ({ id }) => {
	try {
		const expiresIn = jwtConfig.access_expiresIn

		const accessToken = jwt.sign({ id }, jwtConfig.access_secret, {
			expiresIn,
		})

		return { accessToken, expiresIn }
	} catch (error) {
		console.log(error)
		return null
	}
}
