const toast = ({ title = '', message = '', type = 'success' }) => {
	const header = title
		? `<div class="toast-header"><span>${title}</span></div>`
		: ''

	const html = `
        <div class="toast ${type}">
            ${header}
			<div class="toast-body">${message}</div>
		</div>
    `

	const div = document.createElement('div')

	if (type === 'success') {
		div.classList.add('toast-wrapper')
	}

	div.innerHTML = html
	document.body.appendChild(div)

	setTimeout(() => {
		div.remove()
	}, 3000)
}

const ShowUserInfo = () => {
	const user = JSON.parse(localStorage.getItem('user'))

	if (user) {
		const userElement = document.querySelector('.user-info')
		userElement.innerHTML = `
            <p>${user.name}</p>
            <p class="text-sm">${user.email}</p>
        `
	}
}

const GetAccessToken = async () => {
	try {
		const resp = await fetch('http://localhost:3000/api/v1/auth/refresh', {
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})

		const data = await resp.json()

		if (!data.success) {
			window.location.href = '/login.html'
		}

		return data
	} catch (error) {
		console.error(error)
	}
}

const GetTasks = async ({ accessToken }) => {
	try {
		const resp = await fetch('http://localhost:3000/api/v1/tasks', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})

		const data = await resp.json()

		return data
	} catch (error) {
		console.error(error)
	}
}

const ShowTasks = ({ tasks }) => {
	const tasksElement = document.querySelector('.tasks')

	if (!tasks.length) {
		tasksElement.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay tareas</td>
            </tr>
        `
		return
	}

	const defaultStatus = {
		completed: '<span class="badge badge-success">Completado</span>',
		pending: '<span class="badge badge-warning">Pendiente</span>',
		in_progress: '<span class="badge badge-info">En progreso</span>',
	}

	const html = tasks
		.map(
			({ title, description, file, status, categoryId }) => `
        <tr>
            <td width="150">
                ${title}
            </td>
            <td width="250">${description}</td>
            <td width="80">${categoryId}</td>
            <td width="80">${file}</td>
            <td width="60" class="text-center">
                ${defaultStatus[status] || status}
            </td>
            <td width="170" class="text-center">
                <button>Editar</button>
                <button>Eliminar</button>
            </td>
        </tr>
    `
		)
		.join('')

	tasksElement.innerHTML = html
}

const GetCategories = async ({ accessToken }) => {
	try {
		const resp = await fetch('http://localhost:3000/api/v1/categories', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})

		const data = await resp.json()

		return data
	} catch (error) {
		console.error(error)
	}
}

const ShowCategories = ({ categories }) => {
	const categoriesElement = document.querySelector('#category')

	const html =
		'<option value="">Selecciona una categoría</option>' +
		categories
			.map(({ id, name }) => `<option value="${id}">${name}</option>`)
			.join('')

	categoriesElement.innerHTML = html
}

const createTask = async () => {
	try {
		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const accessToken = responseAccess.data.accessToken

		const title = document.querySelector('#title').value
		const description = document.querySelector('#description').value
		const categoryId = document.querySelector('#category').value
		const file = document.querySelector('#file').files[0]

		const user = localStorage.getItem('user')
		const userId = JSON.parse(user).id

		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('categoryId', categoryId)
		formData.append('file', file)
		formData.append('userId', userId)

		const resp = await fetch('http://localhost:3000/api/v1/tasks', {
			method: 'POST',
			headers: {
				'Conte-Type': 'multipart/form-data',
				Authorization: `Bearer ${accessToken}`,
			},
			body: formData,
		})

		const data = await resp.json()

		console.log({ data })

		return data
	} catch (error) {
		console.error(error)
	}
}
