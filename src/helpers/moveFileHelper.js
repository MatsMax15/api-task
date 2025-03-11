import fs from 'fs'
import path from 'path'

export const moveFile = async ({ file }) => {
	try {
		if (!file) {
			return { pathDb: null }
		}

		const uploadDir = path.join('./public/assets/uploads/', 'tasks')
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true })
		}

		const fileName = Date.now() + path.extname(file.originalname)

		const filePath = path.join(uploadDir, fileName)

		fs.writeFileSync(filePath, file.buffer)

		return { fileName }
	} catch (err) {
		throw new Error(`Error moving file: ${err.message}`)
	}
}
