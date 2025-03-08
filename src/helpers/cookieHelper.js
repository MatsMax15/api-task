import dotenv from 'dotenv'

dotenv.config()

export const setCookie = ({ res, refreshToken, expiresIn }) => {
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: !(process.env.NODE_ENV === 'development'),
		maxAge: expiresIn,
	})

	return res
}
