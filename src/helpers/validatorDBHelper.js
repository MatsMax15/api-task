import { Category, User } from '../models/index.js'

export const userExists = async ({ field, value }) => {
	const user = await User.findOne({ where: { [field]: value } })

	return user
}

export const categoryExists = async ({ id }) => {
	const category = await Category.findByPk(id)

	return category
}
