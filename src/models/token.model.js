import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequalize.js'

export const Token = sequelize.define('token', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	expiresIn: {
		type: DataTypes.DATE,
		allowNull: false,
	},
})
