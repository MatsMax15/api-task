import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API de Tareas',
			version: '1.0.0',
			description: 'Documentación de la API para gestionar tareas.',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Servidor de desarrollo',
			},
		],
	},
	apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsDoc(options)

export default (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
