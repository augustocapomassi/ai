const database = require('./database');

class TaskService {
  async getAllTasks() {
    try {
      const [rows] = await database.getConnection().execute(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      throw error;
    }
  }

  async getTaskById(id) {
    try {
      const [rows] = await database.getConnection().execute(
        'SELECT * FROM tasks WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo tarea por ID:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const { title, description, completed = false } = taskData;
      const [result] = await database.getConnection().execute(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        [title, description, completed]
      );
      
      const newTask = await this.getTaskById(result.insertId);
      return newTask;
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }

  async updateTask(id, taskData) {
    try {
      const { title, description, completed } = taskData;
      const [result] = await database.getConnection().execute(
        'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
        [title, description, completed, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      const updatedTask = await this.getTaskById(id);
      return updatedTask;
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      const [result] = await database.getConnection().execute(
        'DELETE FROM tasks WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }

  async toggleTaskCompletion(id) {
    try {
      const task = await this.getTaskById(id);
      if (!task) {
        return null;
      }

      const [result] = await database.getConnection().execute(
        'UPDATE tasks SET completed = ? WHERE id = ?',
        [!task.completed, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      const updatedTask = await this.getTaskById(id);
      return updatedTask;
    } catch (error) {
      console.error('Error cambiando estado de tarea:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();
