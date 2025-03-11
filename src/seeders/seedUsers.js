import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

import { User } from '../models/user.model.js'

export const seedUsers = async () => {
	try {
		const dataUsers = []

		const users = Array.from({ length: 6 }, () => {
			const password = faker.internet.password()
			const email = faker.internet.email()
			const hash = bcrypt.hashSync(password)

			dataUsers.push({
				email,
				password,
			})

			return {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email,
				password: hash,
			}
		})

		await User.bulkCreate(users)

		console.log('✅ Usuarios de prueba insertados correctamente.')
		return dataUsers
	} catch (err) {
		console.error('❌ Error al insertar usuarios de prueba:', err)
	}
}
