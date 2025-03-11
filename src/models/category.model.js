import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequalize.js'

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
