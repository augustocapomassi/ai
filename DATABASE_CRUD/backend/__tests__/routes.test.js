const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const taskService = require('../src/taskService');

// Mock del taskService
jest.mock('../src/taskService');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    test('debe retornar todas las tareas', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Tarea 1',
          description: 'Descripción 1',
          completed: false,
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          title: 'Tarea 2',
          description: 'Descripción 2',
          completed: true,
          created_at: '2023-01-02T00:00:00.000Z',
          updated_at: '2023-01-02T00:00:00.000Z'
        }
      ];

      taskService.getAllTasks.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTasks);
      expect(taskService.getAllTasks).toHaveBeenCalledTimes(1);
    });

    test('debe manejar errores correctamente', async () => {
      taskService.getAllTasks.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .get('/api/tasks')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error obteniendo tareas');
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('debe retornar una tarea por ID', async () => {
      const mockTask = {
        id: 1,
        title: 'Tarea de prueba',
        description: 'Descripción',
        completed: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      taskService.getTaskById.mockResolvedValue(mockTask);

      const response = await request(app)
        .get('/api/tasks/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTask);
      expect(taskService.getTaskById).toHaveBeenCalledWith('1');
    });

    test('debe retornar 404 para tarea inexistente', async () => {
      taskService.getTaskById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/tasks/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarea no encontrada');
    });
  });

  describe('POST /api/tasks', () => {
    test('debe crear una nueva tarea', async () => {
      const taskData = {
        title: 'Nueva tarea',
        description: 'Descripción de la nueva tarea',
        completed: false
      };

      const mockCreatedTask = {
        id: 1,
        ...taskData,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      taskService.createTask.mockResolvedValue(mockCreatedTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCreatedTask);
      expect(response.body.message).toBe('Tarea creada exitosamente');
      expect(taskService.createTask).toHaveBeenCalledWith(taskData);
    });

    test('debe validar que el título es requerido', async () => {
      const taskData = {
        description: 'Descripción sin título'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El título es requerido');
    });

    test('debe validar que el título no esté vacío', async () => {
      const taskData = {
        title: '   ',
        description: 'Descripción'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El título es requerido');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('debe actualizar una tarea', async () => {
      const taskData = {
        title: 'Tarea actualizada',
        description: 'Descripción actualizada',
        completed: true
      };

      const mockUpdatedTask = {
        id: 1,
        ...taskData,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      taskService.updateTask.mockResolvedValue(mockUpdatedTask);

      const response = await request(app)
        .put('/api/tasks/1')
        .send(taskData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUpdatedTask);
      expect(response.body.message).toBe('Tarea actualizada exitosamente');
      expect(taskService.updateTask).toHaveBeenCalledWith('1', taskData);
    });

    test('debe retornar 404 para tarea inexistente', async () => {
      const taskData = {
        title: 'Tarea inexistente',
        description: 'Descripción',
        completed: false
      };

      taskService.updateTask.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/tasks/999')
        .send(taskData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarea no encontrada');
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    test('debe cambiar el estado de completado', async () => {
      const mockToggledTask = {
        id: 1,
        title: 'Tarea',
        description: 'Descripción',
        completed: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      taskService.toggleTaskCompletion.mockResolvedValue(mockToggledTask);

      const response = await request(app)
        .patch('/api/tasks/1/toggle')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockToggledTask);
      expect(response.body.message).toBe('Estado de tarea actualizado');
      expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1');
    });

    test('debe retornar 404 para tarea inexistente', async () => {
      taskService.toggleTaskCompletion.mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/tasks/999/toggle')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarea no encontrada');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('debe eliminar una tarea', async () => {
      taskService.deleteTask.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/tasks/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tarea eliminada exitosamente');
      expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    });

    test('debe retornar 404 para tarea inexistente', async () => {
      taskService.deleteTask.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/tasks/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarea no encontrada');
    });
  });
});
