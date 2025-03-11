import { faker } from '@faker-js/faker'

import { Task } from '../models/task.model.js'
import { User } from '../models/user.model.js'
import { Category } from '../models/category.model.js'

export const seedTasks = async () => {
	try {
		const users = await User.findAll()
		const categories = await Category.findAll()

		const tasks = Array.from({ length: 150 }, () => {
			const randomUser = users[Math.floor(Math.random() * users.length)]
			const randomCategory =
				categories[Math.floor(Math.random() * categories.length)]

			const img = [
				'img-1.jpg',
				'img-2.jpg',
				'img-3.jpg',
				'img-4.jpg',
				'img-5.jpg',
			]

			const ramdomImg = Math.floor(Math.random() * img.length)

			return {
				id: faker.string.uuid(),
				userId: randomUser.id,
				categoryId: randomCategory.id,
				title: faker.lorem.words(5),
				description: faker.lorem.sentence(20),
				file: img[ramdomImg],
				status: faker.helpers.arrayElement(['pending', 'completed']),
				dateLimit: faker.date.future(),
			}
		})

		await Task.bulkCreate(tasks)
		console.log('✅ Tareas de prueba insertadas correctamente.')
	} catch (err) {
		console.error('❌ Error al insertar tareas de prueba:', err)
	}
}
