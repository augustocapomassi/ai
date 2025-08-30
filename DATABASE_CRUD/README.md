# 📋 Aplicación de Gestión de Tareas

Una aplicación completa de gestión de tareas desarrollada con **React** (frontend) y **Express.js** (backend), utilizando **MySQL** como base de datos y **Docker** para la containerización.

## 🚀 Características

- ✅ **CRUD completo** para tareas (Crear, Leer, Actualizar, Eliminar)
- 🎨 **Interfaz moderna** con React y CSS personalizado
- 🗄️ **Base de datos MySQL** con operaciones optimizadas
- 🐳 **Docker Compose** para fácil despliegue
- 🧪 **Pruebas unitarias** para el backend
- 📱 **Diseño responsivo** para móviles y desktop
- ⚡ **API REST** bien documentada

## 🏗️ Arquitectura del Proyecto

```
DATABASE_CRUD/
├── backend/                 # Servidor Express.js
│   ├── src/
│   │   ├── database.js      # Configuración de MySQL
│   │   ├── taskService.js   # Lógica de negocio
│   │   └── routes.js        # Endpoints de la API
│   ├── __tests__/           # Pruebas unitarias
│   ├── server.js            # Servidor principal
│   ├── config.js            # Configuración
│   └── Dockerfile           # Imagen Docker del backend
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Servicios API
│   │   └── App.js           # Componente principal
│   └── Dockerfile           # Imagen Docker del frontend
├── docker-compose.yml       # Orquestación de contenedores
├── init.sql                 # Script de inicialización de BD
├── start.sh                 # Script de inicio (Linux/Mac)
├── start.bat                # Script de inicio (Windows)
└── README.md                # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL2** - Cliente de base de datos
- **Jest** - Framework de pruebas
- **Supertest** - Pruebas de API

### Frontend
- **React 18** - Biblioteca de UI
- **Axios** - Cliente HTTP
- **CSS3** - Estilos personalizados

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **MySQL 8.0** - Base de datos

## 📋 Campos de las Tareas

Cada tarea contiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Integer | Identificador único (auto-incremento) |
| `title` | String | Título de la tarea (requerido) |
| `description` | Text | Descripción detallada (opcional) |
| `completed` | Boolean | Estado de completado (default: false) |
| `created_at` | Timestamp | Fecha de creación |
| `updated_at` | Timestamp | Fecha de última actualización |

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Docker Desktop** instalado y ejecutándose
- **Git** para clonar el repositorio

### Opción 1: Ejecución con Docker (Recomendado)

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd DATABASE_CRUD
   ```

2. **Ejecutar con Docker Compose:**
   
   **En Windows:**
   ```cmd
   start.bat
   ```
   
   **En Linux/Mac:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MySQL: localhost:3306

### Opción 2: Ejecución Manual

#### Backend

1. **Navegar al directorio backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # Crear archivo .env basado en config.js
   cp config.js .env
   ```

4. **Iniciar MySQL** (asegúrate de que esté ejecutándose en el puerto 3306)

5. **Ejecutar el servidor:**
   ```bash
   npm start
   # o para desarrollo:
   npm run dev
   ```

#### Frontend

1. **Navegar al directorio frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

## 🧪 Ejecutar Pruebas

### Backend

```bash
cd backend
npm test
```

### Cobertura de Pruebas

```bash
cd backend
npm test -- --coverage
```

## 📚 API Endpoints

### Base URL: `http://localhost:3001/api`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tasks` | Obtener todas las tareas |
| `GET` | `/tasks/:id` | Obtener una tarea por ID |
| `POST` | `/tasks` | Crear una nueva tarea |
| `PUT` | `/tasks/:id` | Actualizar una tarea |
| `PATCH` | `/tasks/:id/toggle` | Cambiar estado de completado |
| `DELETE` | `/tasks/:id` | Eliminar una tarea |

### Ejemplos de Uso

#### Crear una tarea
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi nueva tarea",
    "description": "Descripción de la tarea",
    "completed": false
  }'
```

#### Obtener todas las tareas
```bash
curl http://localhost:3001/api/tasks
```

#### Actualizar una tarea
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea actualizada",
    "description": "Nueva descripción",
    "completed": true
  }'
```

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener todos los servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir y reiniciar
docker-compose up --build

# Acceder al contenedor de MySQL
docker-compose exec mysql mysql -u root -p tasks_db
```

## 🔧 Configuración de Base de Datos

### Credenciales por Defecto

- **Host:** localhost
- **Puerto:** 3306
- **Usuario:** root
- **Contraseña:** password
- **Base de datos:** tasks_db

### Estructura de la Tabla

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎨 Características de la Interfaz

- **Diseño moderno** con gradientes y sombras
- **Responsive design** para móviles y desktop
- **Estados visuales** para tareas completadas/pendientes
- **Modal de edición** para modificar tareas
- **Confirmación** antes de eliminar tareas
- **Mensajes de éxito/error** informativos
- **Contador de tareas** completadas

## 🚨 Solución de Problemas

### Error de Conexión a la Base de Datos

1. Verificar que MySQL esté ejecutándose
2. Comprobar las credenciales en `config.js`
3. Asegurar que el puerto 3306 esté disponible

### Error de CORS

El backend está configurado para aceptar peticiones desde `localhost:3000`. Si usas un puerto diferente, modifica la configuración de CORS en `server.js`.

### Puerto en Uso

Si el puerto 3001 está ocupado, modifica la variable `PORT` en `config.js` o en las variables de entorno.

## 📝 Desarrollo

### Estructura de Archivos del Backend

- `server.js` - Punto de entrada del servidor
- `config.js` - Configuración de la aplicación
- `src/database.js` - Conexión y configuración de MySQL
- `src/taskService.js` - Lógica de negocio para tareas
- `src/routes.js` - Definición de endpoints de la API

### Estructura de Archivos del Frontend

- `src/App.js` - Componente principal de la aplicación
- `src/components/TaskForm.js` - Formulario para crear/editar tareas
- `src/components/TaskList.js` - Lista de tareas
- `src/components/TaskItem.js` - Componente individual de tarea
- `src/services/api.js` - Cliente HTTP para la API

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como ejemplo de aplicación full-stack con React, Express.js y MySQL.

---

**¡Disfruta gestionando tus tareas! 🎉**
