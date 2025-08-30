const express = require('express');
const taskService = require('./taskService');

const router = express.Router();

// GET /api/tasks - Obtener todas las tareas
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo tareas',
      error: error.message
    });
  }
});

// GET /api/tasks/:id - Obtener una tarea por ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo tarea',
      error: error.message
    });
  }
});

// POST /api/tasks - Crear una nueva tarea
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido'
      });
    }

    const newTask = await taskService.createTask({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: completed || false
    });

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Tarea creada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando tarea',
      error: error.message
    });
  }
});

// PUT /api/tasks/:id - Actualizar una tarea
router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido'
      });
    }

    const updatedTask = await taskService.updateTask(id, {
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: completed
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Tarea actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando tarea',
      error: error.message
    });
  }
});

// PATCH /api/tasks/:id/toggle - Cambiar estado de completado
router.patch('/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.toggleTaskCompletion(id);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Estado de tarea actualizado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cambiando estado de tarea',
      error: error.message
    });
  }
});

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await taskService.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando tarea',
      error: error.message
    });
  }
});

module.exports = router;
