import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequalize.js'
import { Token } from './token.model.js'
import { Task } from './task.model.js'

export const User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			autoIncrement: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		defaultScope: {
			attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
		},
		scopes: {
			withPassword: {
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
			},
		},
	}
)

User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' })
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' })
