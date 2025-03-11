import { sequelize } from '../database/sequalize.js'

export const seedDB = async () => {
	try {
		await sequelize.sync({ force: true })
		console.log('🛠 Base de datos sincronizada.')
	} catch (err) {
		console.error('❌ Error al sincronizar la base de datos:', err)
	}
}
