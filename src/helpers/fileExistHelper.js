import fs from 'fs/promises'

export const fileExist = async (filePath) => {
	try {
		await fs.access(filePath)
		return true
	} catch (error) {
		return false
	}
}
