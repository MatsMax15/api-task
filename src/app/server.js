import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { config } from '../config/server.config.js'

import authRouter from '../routes/auth.routes.js'
import taskRouter from '../routes/task.routes.js'
import categoryRouter from '../routes/category.routes.js'

import swaggerSetup from './../../swagger.js'

class Server {
	constructor() {
		this.app = express()
		this.port = config.PORT
		this.apiPath = config.API_PATH
		this.paths = {
			auth: `${this.apiPath}/auth`,
			tasks: `${this.apiPath}/tasks`,
			category: `${this.apiPath}/categories`,
		}

		swaggerSetup(this.app)

		// middlewares
		this.middlewares()

		// routes
		this.routes()
	}

	start() {
		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}`)
			console.log(`http://localhost:${this.port}`)
			console.log(`http://localhost:${this.port}/api-docs`)
		})
	}

	middlewares() {
		// parse body
		this.app.use(express.json())

		// cors
		this.app.use(cors())

		// cookie parser
		this.app.use(cookieParser())

		// public folder
		this.app.use(express.static('public'))
	}

	routes() {
		this.app.use(this.paths.auth, authRouter)
		this.app.use(this.paths.tasks, taskRouter)
		this.app.use(this.paths.category, categoryRouter)
	}
}

export default Server
