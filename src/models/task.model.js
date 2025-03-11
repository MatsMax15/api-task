import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequalize.js'
import { Category } from './category.model.js'

export const Task = sequelize.define(
	'task',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
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
		dateLimit: {
			type: DataTypes.DATE,
			allowNull: false,
			get() {
				return this.getDataValue('dateLimit').toISOString().split('T')[0]
			},
		},
	},
	{
		defaultScope: {
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		},
	}
)

Task.belongsTo(Category, {
	foreignKey: 'categoryId',
	as: 'category',
	onDelete: 'NO ACTION',
})
