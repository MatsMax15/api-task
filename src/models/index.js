import { sequelize } from '../database/sequalize.js'
import { User } from './user.model.js'
import { Category, createDefaultCategories } from './category.model.js'
import { Task } from './task.model.js'
import { Token } from './token.model.js'

// Uncomment the following line to force the database to sync
// await sequelize.sync({ force: true })
// await createDefaultCategories()

export { sequelize, User, Category, Task, Token }
