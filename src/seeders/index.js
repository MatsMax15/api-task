import { seedDB } from './seedDB.js'
import { seedUsers } from './seedUsers.js'
import { seedTasks } from './seedTasks.js'
import { seedCategories } from './seedCategories.js'

const seed = async () => {
	try {
		await seedDB()

		await seedCategories()
		const dataUsers = await seedUsers()
		await seedTasks()

		console.log('✅ Datos de prueba insertados correctamente.')
		console.log('🔒 Usuarios:')
		console.table(dataUsers)
	} catch (err) {
		console.error('❌ Error al insertar datos de prueba:', err)
	}
}

seed()
