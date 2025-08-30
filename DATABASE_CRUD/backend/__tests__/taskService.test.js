const mysql = require('mysql2/promise');
const taskService = require('../src/taskService');
const config = require('../config');

describe('TaskService', () => {
  let connection;
  let testTaskId;

  beforeAll(async () => {
    // Crear conexión a base de datos de prueba
    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: 'tasks_test_db'
    });

    // Crear base de datos de prueba si no existe
    await connection.execute('CREATE DATABASE IF NOT EXISTS tasks_test_db');
    await connection.execute('USE tasks_test_db');

    // Crear tabla de tareas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Limpiar tabla antes de las pruebas
    await connection.execute('DELETE FROM tasks');
  });

  afterAll(async () => {
    if (connection) {
      await connection.execute('DROP DATABASE IF EXISTS tasks_test_db');
      await connection.end();
    }
  });

  beforeEach(async () => {
    // Limpiar tabla antes de cada prueba
    await connection.execute('DELETE FROM tasks');
  });

  describe('createTask', () => {
    test('debe crear una nueva tarea correctamente', async () => {
      const taskData = {
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        completed: false
      };

      const result = await taskService.createTask(taskData);

      expect(result).toBeDefined();
      expect(result.title).toBe(taskData.title);
      expect(result.description).toBe(taskData.description);
      expect(result.completed).toBe(taskData.completed);
      expect(result.id).toBeDefined();
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();

      testTaskId = result.id;
    });

    test('debe crear una tarea con valores por defecto', async () => {
      const taskData = {
        title: 'Tarea simple'
      };

      const result = await taskService.createTask(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.description).toBe('');
      expect(result.completed).toBe(false);
    });
  });

  describe('getAllTasks', () => {
    test('debe retornar todas las tareas', async () => {
      // Crear tareas de prueba
      await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea 1', 'Descripción 1', false]
      );
      await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea 2', 'Descripción 2', true]
      );

      const tasks = await taskService.getAllTasks();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Tarea 1');
      expect(tasks[1].title).toBe('Tarea 2');
    });

    test('debe retornar array vacío cuando no hay tareas', async () => {
      const tasks = await taskService.getAllTasks();
      expect(tasks).toHaveLength(0);
    });
  });

  describe('getTaskById', () => {
    test('debe retornar una tarea por ID', async () => {
      // Crear tarea de prueba
      const [result] = await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea de prueba', 'Descripción', false]
      );

      const task = await taskService.getTaskById(result.insertId);

      expect(task).toBeDefined();
      expect(task.id).toBe(result.insertId);
      expect(task.title).toBe('Tarea de prueba');
    });

    test('debe retornar null para ID inexistente', async () => {
      const task = await taskService.getTaskById(99999);
      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    test('debe actualizar una tarea correctamente', async () => {
      // Crear tarea de prueba
      const [result] = await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea original', 'Descripción original', false]
      );

      const updateData = {
        title: 'Tarea actualizada',
        description: 'Descripción actualizada',
        completed: true
      };

      const updatedTask = await taskService.updateTask(result.insertId, updateData);

      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.description).toBe(updateData.description);
      expect(updatedTask.completed).toBe(updateData.completed);
      expect(updatedTask.id).toBe(result.insertId);
    });

    test('debe retornar null para ID inexistente', async () => {
      const updateData = {
        title: 'Tarea inexistente',
        description: 'Descripción',
        completed: false
      };

      const result = await taskService.updateTask(99999, updateData);
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    test('debe eliminar una tarea correctamente', async () => {
      // Crear tarea de prueba
      const [result] = await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea a eliminar', 'Descripción', false]
      );

      const deleted = await taskService.deleteTask(result.insertId);
      expect(deleted).toBe(true);

      // Verificar que la tarea fue eliminada
      const task = await taskService.getTaskById(result.insertId);
      expect(task).toBeNull();
    });

    test('debe retornar false para ID inexistente', async () => {
      const deleted = await taskService.deleteTask(99999);
      expect(deleted).toBe(false);
    });
  });

  describe('toggleTaskCompletion', () => {
    test('debe cambiar el estado de completado de false a true', async () => {
      // Crear tarea de prueba
      const [result] = await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea pendiente', 'Descripción', false]
      );

      const updatedTask = await taskService.toggleTaskCompletion(result.insertId);

      expect(updatedTask).toBeDefined();
      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.id).toBe(result.insertId);
    });

    test('debe cambiar el estado de completado de true a false', async () => {
      // Crear tarea de prueba
      const [result] = await connection.execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        ['Tarea completada', 'Descripción', true]
      );

      const updatedTask = await taskService.toggleTaskCompletion(result.insertId);

      expect(updatedTask).toBeDefined();
      expect(updatedTask.completed).toBe(false);
      expect(updatedTask.id).toBe(result.insertId);
    });

    test('debe retornar null para ID inexistente', async () => {
      const result = await taskService.toggleTaskCompletion(99999);
      expect(result).toBeNull();
    });
  });
});
