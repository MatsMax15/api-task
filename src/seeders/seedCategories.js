import { Category } from '../models/category.model.js'

export const seedCategories = async () => {
	try {
		const defaultCategories = [
			'Trabajo',
			'Personal',
			'Estudio',
			'Ocio',
			'Salud',
			'Familia',
			'Amigos',
			'Compras',
			'Deportes',
			'Viajes',
			'Otros',
		]

		const categories = defaultCategories.map((category) => ({ name: category }))

		await Category.bulkCreate(categories)
		console.log('✅ Categorías de prueba insertadas correctamente.')
	} catch (err) {
		console.error('❌ Error al insertar categorías de prueba:', err)
	}
}
