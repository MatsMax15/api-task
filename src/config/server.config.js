import dotenv from 'dotenv'

dotenv.config()

export const config = {
	PORT: process.env.PORT,
	API_PATH: process.env.API_PATH,
}
