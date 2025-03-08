import multer from 'multer'
import path from 'path'
import { errorResponse } from '../helpers/responseHelper.js'

// 📂 Storage
const storage = multer.memoryStorage({
	// destination: (req, file, cb) => {
	// 	cb(null, './public/assets/uploads/')
	// },
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

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
	fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 },
})

// 📌 Middleware
export const uploadMiddleware = (req, res, next) => {
	upload.single('file')(req, res, (err) => {
		const file = req.file
		if (!file) next()

		if (err) {
			console.log(err)

			return errorResponse({
				res,
				status_text: 'Bad Request File',
				status_code: 400,
				message: err.message,
			})
		}

		next()
	})
}
