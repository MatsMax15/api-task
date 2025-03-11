import multer from 'multer'
import path from 'path'
import { errorResponse } from '../helpers/responseHelper.js'

// 📂 Storage
const storage = multer.memoryStorage()

// 📌 Filters
const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		'image/jpeg',
		'image/png',
		'image/jpg',
		'image/gif',
		'application/pdf',
	]

	if (!allowedTypes.includes(file.mimetype)) {
		return cb(new Error('Only .jpg, .jpeg, .png, .gif, .pdf format allowed!'))
	}

	cb(null, true)
}

const upload = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024, files: 1 },
	fileFilter,
})

// 📌 Middleware
export const uploadMiddleware = (req, res, next) => {
	upload.single('file')(req, res, (err) => {
		if (err) {
			const message =
				err.code === 'LIMIT_FILE_SIZE'
					? 'File size too large. Max limit is 2MB'
					: err.message

			return errorResponse({
				res,
				status_text: 'Bad Request File',
				status_code: 400,
				message,
			})
		}

		next()
	})
}
