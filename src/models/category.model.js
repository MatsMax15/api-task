import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequalize.js'
import { Task } from './task.model.js'

export const Category = sequelize.define(
	'category',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		timestamps: false,
	}
)

Category.hasMany(Task, { foreignKey: 'categoryId', onDelete: 'NO ACTION' })

const defaultCategories = ['Trabajo', 'Personal', 'Estudio', 'Ocio']

export const createDefaultCategories = async () => {
	const categories = await Category.findAll()

	if (categories.length === 0) {
		defaultCategories.forEach(async (category) => {
			await Category.create({ name: category })
		})
	}
}
