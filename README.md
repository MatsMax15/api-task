# API de Gestión de Tareas

## 📌 Requisitos

Antes de instalar la API, asegúrate de tener instalado:

- **Node.js** (versión recomendada: 20 o superior)
- **pnpm** (gestor de paquetes): Si no lo tienes, instálalo con:
  ```sh
  npm install -g pnpm
  ```
- **MySQL** (para la base de datos)

## 🚀 Instalación

1. Clona el repositorio:
   ```sh
   📥 git clone https://github.com/MatsMax15/api-task.git
   📂 cd api-task
   ```
2. Cambia a la rama `test`:
   ```bash
   git checkout test
   ```
3. Instala las dependencias con **pnpm**:
   ```sh
   pnpm install
   ```
4. Crea un archivo `.env` basado en `.env.example` y configura las variables de entorno.

## 📦 Configuración de la base de datos

1. Ejecuta el **seed** para crear las tablas y agregar registros iniciales:
   ```sh
   pnpm run seed
   ```

Podrás ver en consola una tabla con los usuarios de prueba registrados para realizar las pruebas correspondientes.

## 🏃‍♂️ Ejecución en modo desarrollo

Para iniciar el servidor en modo desarrollo, usa el siguiente comando:

```sh
pnpm run dev
```

El servidor se ejecutará en `http://localhost:3000` (según tu configuración en `.env`).

## 🧪 Pruebas con interfaz gráfica

Para realizar pruebas usando una interfaz, puedes acceder a:

```sh
🌍 http://localhost:3000/login.html
```

---

## 📚 Dependencias principales

La API usa las siguientes librerías:

- 🔐 **bcryptjs**: Para encriptar y comparar 🔑 contraseñas de los usuarios.
- 🍪 **cookie-parser**: Permite manejar cookies en las peticiones HTTP.
- 🌍 **cors**: Middleware para manejar CORS (acceso entre dominios).
- 🏗️ **dotenv**: Maneja variables de entorno desde un archivo `.env`.
- ⚡ **express**: Framework para construir la API de manera rápida y sencilla.
- ✅ **express-validator**: Middleware para validar los datos enviados en las peticiones.
- 🔑 **jsonwebtoken**: Genera y verifica tokens JWT para autenticación.
- 📂 **multer**: Manejo de archivos en las peticiones (subida de archivos).
- 🗄️ **mysql2**: Cliente para conectarse y ejecutar consultas en MySQL.
- 📦 **sequelize**: ORM para interactuar con la base de datos MySQL de forma más sencilla.
- 📜 **swagger-jsdoc**: Permite documentar la API utilizando Swagger.
- 📖 **swagger-ui-express**: Habilita una interfaz visual para la documentación de la API con Swagger. (`/api-docs`).

---

## 📄 Documentación API

Una vez que el servidor esté corriendo, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

Aquí podrás probar los endpoints y ver los detalles de cada ruta.

---
