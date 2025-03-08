import dotenv from 'dotenv'

dotenv.config()

export default {
	// refresh_secret:
	refresh_secret: process.env.JWT_REFRESH_SECRET,
	refresh_expiresIn: 1000 * 60 * 60 * 24 * 7,
	// access_secret:
	access_secret: process.env.JWT_ACCESS_SECRET,
	access_expiresIn: 15 * 60,
}
