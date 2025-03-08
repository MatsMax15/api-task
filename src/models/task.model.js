import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequalize.js'
// import { Category } from './category.model.js'

export const Task = sequelize.define(
	'task',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			autoIncrement: false,
			primaryKey: true,
		},
		categoryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		file: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('pending', 'completed'),
			allowNull: false,
			defaultValue: 'pending',
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		defaultScope: {
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		},
	}
)
