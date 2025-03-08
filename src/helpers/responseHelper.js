export const successResponse = ({
	res,
	status_code = 200,
	message = 'Success',
	data = {},
}) => {
	return res.status(status_code).json({
		success: true,
		status_code,
		status_text: 'OK',
		message,
		data,
	})
}

export const errorResponse = ({
	res,
	status_code = 500,
	status_text = 'Server Error',
	message,
	errorDetails = null,
}) => {
	const errors = errorDetails ? errorDetails.map((error) => error.msg) : null

	return res.status(status_code).json({
		success: false,
		status_code,
		status_text,
		message,
		errors,
	})
}
