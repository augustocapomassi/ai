-- Script de inicialización para la base de datos MySQL
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

USE tasks_db;

-- Crear tabla de tareas si no existe
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar algunas tareas de ejemplo
INSERT INTO tasks (title, description, completed) VALUES
('Configurar proyecto', 'Configurar la estructura inicial del proyecto de tareas', false),
('Implementar API', 'Crear endpoints para operaciones CRUD', false),
('Crear interfaz React', 'Desarrollar la interfaz de usuario con React', false),
('Configurar Docker', 'Configurar contenedores con Docker Compose', true),
('Escribir documentación', 'Crear README con instrucciones de uso', false);
