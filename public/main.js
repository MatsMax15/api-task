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
	}, 4000)
}

const togglePass = (element) => {
	const parent = element.closest('.form-group')
	const pass = parent.querySelector('.password')

	if (pass.type === 'password') {
		pass.type = 'text'
		element.classList.add('active')
	} else {
		pass.type = 'password'
		element.classList.remove('active')
	}
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

const GetTasks = async ({
	accessToken,
	page = 1,
	perPage = 10,
	offset = 0,
	search = '',
	href = '',
}) => {
	try {
		const query = href
			? href
			: `?page=${page}&perPage=${perPage}&offset=${offset}&search=${search}`

		const url = `http://localhost:3000/api/v1/tasks${query}`

		const resp = await fetch(url, {
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
		completed:
			'<span class="badge badge-success"><ion-icon name="checkmark-done-outline"></ion-icon></span>',
		pending:
			'<span class="badge badge-warning"><ion-icon name="alert-outline"></ion-icon></span>',
		in_progress: '<span class="badge badge-info">En progreso</span>',
	}

	const btnDownload = ({ id }) => {
		return `<button class="btn btn-actions" onclick="downloadFile('${id}')">
            <ion-icon name="cloud-download-outline"></ion-icon>
        </button>`
	}

	const btnStatus = ({ id, status }) => {
		const icon =
			status === 'completed' ? 'thumbs-down-outline' : 'thumbs-up-outline'

		return `
            <button class="btn btn-actions" onclick="updateStatus('${id}', '${status}')">
                <ion-icon name="${icon}"></ion-icon>
            </button>
        `
	}

	const html = tasks
		.map(
			({ title, dateLimit, file, status, category, id }) => `
        <tr>
            <td width="300">
                <span class="title-task">${title}</span>
            </td>
            <td width="100" class="text-center">${dateLimit}</td>
            <td width="80" class="text-center">${category?.name}</td>
            <td width="50" class="text-center">
                ${defaultStatus[status] || status}
            </td>
            <td width="100" class="text-center">
                <div class="flex gap-1 justify-end">
                    ${file ? btnDownload({ id }) : ''}
                    ${btnStatus({ id, status })}
                    
                    <a href="./task.html?id=${id}" class="btn btn-actions">
                        <ion-icon name="document-text-outline"></ion-icon>
                    </a>
                    <a href="./updateTask.html?id=${id}" class="btn btn-actions">
                        <ion-icon name="create-outline"></ion-icon>
                    </a>
                    <button class="btn btn-actions" onclick="deleteTask('${id}')">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
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

const ShowCategories = ({ categories, type = 'select' }) => {
	const categoriesElement = document.querySelector('#category')

	const optionDefault =
		type === 'filter'
			? '<option value="">Todas</option>'
			: '<option value="">Selecciona una categoría</option>'

	const html =
		optionDefault +
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
		const categoryId = document.querySelector('#category').value
		const dateLimit = document.querySelector('#dateLimit').value
		const description = document.querySelector('#description').value
		const file = document.querySelector('#file').files[0]

		const user = localStorage.getItem('user')
		const userId = JSON.parse(user).id

		const formData = new FormData()
		formData.append('title', title)
		formData.append('categoryId', categoryId)
		formData.append('dateLimit', dateLimit)
		formData.append('description', description)
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

		if (!data.success) {
			return toast({
				title: data.status_text,
				message: data.message,
				type: 'error',
			})
		}

		toast({
			title: data.status_text,
			message: data.message,
			type: 'success',
		})

		setTimeout(() => {
			window.location.href = '/tasks.html'
		}, 3000)
	} catch (error) {
		console.error(error)
	}
}

const downloadFile = async (id) => {
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

		const resp = await fetch(
			`http://localhost:3000/api/v1/tasks/${id}/download`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)

		if (!resp.ok) {
			const errorData = await resp.json()

			toast({
				title: errorData.status_text,
				message: errorData.message,
				type: 'error',
			})

			throw new Error(errorData.message || 'Error al descargar el archivo')
		}

		const blob = await resp.blob()
		const url = window.URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url

		const extType = blob.type.split('/')
		const ext = extType[extType.length - 1]
		const name = `file_task_${new Date().getTime()}.${ext}`

		a.download = name
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)

		window.URL.revokeObjectURL(url)

		toast({
			title: 'Descarga exitosa',
			message: 'El archivo se descargó correctamente',
			type: 'info',
		})
	} catch (error) {
		console.error(error)
	}
}

const updateStatus = async (id, status) => {
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

		const newStatus = status === 'completed' ? 'pending' : 'completed'

		const resp = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ status: newStatus }),
		})

		const data = await resp.json()

		if (!data.success) {
			return toast({
				title: data.status_text,
				message: data.message,
				type: 'error',
			})
		}

		toast({
			title: data.status_text,
			message: data.message,
			type: 'info',
		})

		chargeContent()
	} catch (error) {
		console.error(error)
	}
}

const searchTask = async () => {
	try {
		const search = document.querySelector('#search').value

		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const { accessToken } = responseAccess.data

		const responseTasks = await GetTasks({ accessToken, search })

		if (!responseTasks.success) {
			return toast({
				title: responseTasks.status_text,
				message: responseTasks.message,
				type: 'error',
			})
		}

		const tasks = responseTasks.data
		ShowTasks({ tasks })

		toast({
			title: 'Búsqueda exitosa',
			message: 'Mostando resultados de la búsqueda',
			type: 'info',
		})
	} catch (error) {
		console.error(error)
	}
}

const pagination = ({ meta, links }) => {
	const paginationElement = document.querySelector('.pagination')
	const showingElement = document.querySelector('#showing')
	const perPageElement = document.querySelector('#perPage')

	const showing = `Mostrando ${meta.from} a ${meta.to} de ${meta.count} registros`
	showingElement.innerHTML = showing

	if (links.length === 0) {
		perPageElement.style.display = 'none'
		paginationElement.innerHTML = ''
		return
	}

	const icons = [
		{
			rel: 'first',
			icon: '<ion-icon name="play-back-outline"></ion-icon>',
		},
		{
			rel: 'prev',
			icon: '<ion-icon name="chevron-back-outline"></ion-icon>',
		},
		{
			rel: 'next',
			icon: '<ion-icon name="chevron-forward-outline"></ion-icon>',
		},
		{
			rel: 'last',
			icon: '<ion-icon name="play-forward-outline"></ion-icon>',
		},
	]

	const buttons = icons
		.map(({ rel, icon }) => {
			const link = links.find((link) => link.rel === rel)
			const isActive = link.href && true

			return `<button type="button" class="btn btn-default p-2 text-md ${
				isActive ? 'active' : ''
			}" ${!isActive && 'disabled'} onclick="changePage('${
				link.href
			}')">${icon}</button>`
		})
		.join('')

	paginationElement.innerHTML = buttons
}

const changePage = async (href) => {
	try {
		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const { accessToken } = responseAccess.data

		const responseTasks = await GetTasks({ accessToken, href })

		if (!responseTasks.success) {
			return toast({
				title: responseTasks.status_text,
				message: responseTasks.message,
				type: 'error',
			})
		}

		const { tasks, meta, links } = responseTasks.data

		ShowTasks({ tasks })
		pagination({ meta, links })
	} catch (error) {
		console.log(error)
	}
}

const changePerPage = async () => {
	try {
		const perPage = document.querySelector('#perPage').value

		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const { accessToken } = responseAccess.data

		const responseTasks = await GetTasks({ accessToken, perPage })

		if (!responseTasks.success) {
			return toast({
				title: responseTasks.status_text,
				message: responseTasks.message,
				type: 'error',
			})
		}

		const { tasks, meta, links } = responseTasks.data

		ShowTasks({ tasks })
		pagination({ meta, links })
	} catch (error) {
		console.log(error)
	}
}

const getTasksFilter = async ({ filter, value, accessToken }) => {
	try {
		try {
			const resp = await fetch(
				`http://localhost:3000/api/v1/tasks/${filter}/${value}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			const data = await resp.json()

			return data
		} catch (error) {
			console.error(error)
		}
	} catch (error) {
		console.log(error)
	}
}

const filterTasks = async (filter) => {
	try {
		const value = document.querySelector(`#${filter}`).value

		const statusElement = document.querySelector('#status')
		const categoryElement = document.querySelector('#category')

		if (filter === 'status') {
			categoryElement.value = ''
		} else {
			statusElement.value = ''
		}

		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const { accessToken } = responseAccess.data

		if (!value) {
			const perPageElement = document.querySelector('#perPage')
			perPageElement.style.display = 'block'
			return chargeContent()
		}

		const responseTasks = await getTasksFilter({ filter, value, accessToken })

		if (!responseTasks.success) {
			return toast({
				title: responseTasks.status_text,
				message: responseTasks.message,
				type: 'error',
			})
		}

		const { data: tasks } = responseTasks

		ShowTasks({ tasks })
		pagination({
			meta: {
				count: tasks.length,
				from: 1,
				to: tasks.length,
			},
			links: [],
		})
	} catch (error) {
		console.log(error)
	}
}

const chargeContent = async () => {
	try {
		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const { accessToken } = responseAccess.data

		const responseCategories = await GetCategories({
			accessToken: responseAccess.data.accessToken,
		})

		if (!responseCategories.success) {
			return toast({
				title: responseCategories.status_text,
				message: responseCategories.message,
				type: 'error',
			})
		}

		ShowCategories({
			categories: responseCategories.data,
			type: 'filter',
		})

		const responseTasks = await GetTasks({ accessToken })

		if (!responseTasks.success) {
			return toast({
				title: responseTasks.status_text,
				message: responseTasks.message,
				type: 'error',
			})
		}

		const { tasks, meta, links } = responseTasks.data

		ShowTasks({ tasks })
		pagination({ meta, links })
	} catch (error) {
		console.error(error)
	}
}

const chargeTask = async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		const id = urlParams.get('id')

		if (!id) window.location.href = '/tasks.html'

		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const { accessToken } = responseAccess.data

		const { data: categories } = await GetCategories({ accessToken })
		ShowCategories({ categories })

		const { data: task } = await getTask({ accessToken, id })

		const titleElement = document.querySelector('#title')
		const categoryElement = document.querySelector('#category')
		const dateLimitElement = document.querySelector('#dateLimit')
		const statusElement = document.querySelector('#status')
		const descriptionElement = document.querySelector('#description')

		titleElement.value = task.title
		categoryElement.value = task.categoryId
		dateLimitElement.value = task.dateLimit
		statusElement.value = task.status
		descriptionElement.value = task.description

		// file task
		const hasFile = task.file ? true : false
		const containerFile = document.querySelector('#file-preview')

		if (!hasFile) {
			containerFile.innerHTML = `
                <span class="text-sm">No hay archivo adjunto</span>
            `
		}

		if (hasFile) {
			containerFile.innerHTML = `
                <button
                    type="button"
                    class="btn btn-default border-none p-1 text-xl flex justify-center item-center"
                    onclick="downloadFile('${id}')"
                >
                    <ion-icon name="cloud-download-outline"></ion-icon>
                </button>
                <div class="file-info">
                    <span class="file-name">${task.file}</span>
                </div>
                <button
                    type="button"
                    class="btn btn-default p-1 text-xl border-none flex justify-center item-center btn-delete"
                    onclick="deleteFile('${id}')"
                >
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            `
		}
	} catch (error) {
		console.error(error)
	}
}

const getTask = async ({ accessToken, id }) => {
	try {
		const resp = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
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

const deleteFile = async (id) => {
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

		const resp = await fetch(
			`http://localhost:3000/api/v1/tasks/${id}/delete`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)

		const data = await resp.json()

		if (!data.success) {
			return toast({
				title: data.status_text,
				message: data.message,
				type: 'error',
			})
		}

		toast({
			title: data.status_text,
			message: data.message,
			type: 'info',
		})

		chargeTask()
	} catch (error) {
		console.error(error)
	}
}

const updateTask = async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		const id = urlParams.get('id')

		if (!id) window.location.href = '/tasks.html'

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
		const categoryId = document.querySelector('#category').value
		const dateLimit = document.querySelector('#dateLimit').value
		const status = document.querySelector('#status').value
		const description = document.querySelector('#description').value
		const file = document.querySelector('#file').files[0]

		const user = localStorage.getItem('user')
		const userId = JSON.parse(user).id

		const formData = new FormData()
		formData.append('title', title)
		formData.append('categoryId', categoryId)
		formData.append('dateLimit', dateLimit)
		formData.append('status', status)
		formData.append('description', description)
		formData.append('file', file)
		formData.append('userId', userId)

		const resp = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: formData,
		})

		const data = await resp.json()

		if (!data.success) {
			return toast({
				title: data.status_text,
				message: data.message,
				type: 'error',
			})
		}

		toast({
			title: data.status_text,
			message: data.message,
			type: 'success',
		})

		setTimeout(() => {
			window.location.href = '/tasks.html'
		}, 3000)
	} catch (error) {
		console.error(error)
	}
}

const detailTask = async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		const id = urlParams.get('id')

		if (!id) window.location.href = '/tasks.html'

		const responseAccess = await GetAccessToken()

		if (!responseAccess.success) {
			return toast({
				title: responseAccess.status_text,
				message: responseAccess.message,
				type: 'error',
			})
		}

		const accessToken = responseAccess.data.accessToken

		const { data: task } = await getTask({ accessToken, id })

		const titleElement = document.querySelector('#taskTitle')
		const categoryElement = document.querySelector('#category')
		const dateLimitElement = document.querySelector('#dateLimit')
		const statusElement = document.querySelector('#status')
		const descriptionElement = document.querySelector('#description')

		titleElement.innerHTML = task.title
		categoryElement.innerHTML = task.category?.name
		dateLimitElement.innerHTML = task.dateLimit
		statusElement.innerHTML = task.status
		descriptionElement.innerHTML = task.description

		// file task
		const hasFile = task.file ? true : false
		const containerFile = document.querySelector('#file-preview')

		if (!hasFile) {
			containerFile.innerHTML = `
                <span class="text-sm">No hay archivo adjunto</span>
            `
		}

		if (hasFile) {
			containerFile.innerHTML = `
                <button
                    type="button"
                    class="btn btn-default border-none p-1 text-xl flex justify-center item-center"
                    onclick="downloadFile('${id}')"
                >
                    <ion-icon name="cloud-download-outline"></ion-icon>
                </button>
                <div class="file-info">
                    <span class="file-name">${task.file}</span>
                </div>
                <button
                    type="button"
                    class="btn btn-default p-1 text-xl border-none flex justify-center item-center btn-delete"
                    onclick="deleteFile('${id}')"
                >
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            `
		}
	} catch (error) {
		console.error(error)
	}
}

const deleteTask = async (id) => {
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

		const resp = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		const data = await resp.json()

		if (!data.success) {
			return toast({
				title: data.status_text,
				message: data.message,
				type: 'error',
			})
		}

		toast({
			title: data.status_text,
			message: data.message,
			type: 'info',
		})

		chargeContent()
	} catch (error) {
		console.error(error)
	}
}

const logout = async () => {
	try {
		const resp = await fetch('http://localhost:3000/api/v1/auth/logout')

		const data = await resp.json()

		if (!data.success) {
			return toast({
				title: data.status_text,
				message: data.message,
				type: 'error',
			})
		}

		toast({
			title: data.status_text,
			message: data.message,
			type: 'success',
		})

		localStorage.removeItem('user')

		setTimeout(() => {
			window.location.href = '/login.html'
		}, 2000)
	} catch (error) {
		console.error(error)
	}
}
