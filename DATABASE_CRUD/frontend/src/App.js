import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskAPI } from './services/api';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      setError('Error al cargar las tareas. Verifica que el servidor esté ejecutándose.');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setError(null);
      const response = await taskAPI.createTask(taskData);
      setTasks(prev => [response.data, ...prev]);
      setSuccess('Tarea creada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al crear la tarea');
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setError(null);
      const response = await taskAPI.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? response.data : task
      ));
      setEditingTask(null);
      setShowModal(false);
      setSuccess('Tarea actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al actualizar la tarea');
      console.error('Error updating task:', error);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setError(null);
      const response = await taskAPI.toggleTaskCompletion(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.data : task
      ));
      setSuccess('Estado de tarea actualizado');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al cambiar el estado de la tarea');
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      setError(null);
      await taskAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setSuccess('Tarea eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al eliminar la tarea');
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowModal(false);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📋 Gestor de Tareas</h1>
          <p>Organiza tus tareas de manera eficiente</p>
          {totalTasks > 0 && (
            <p>
              {completedTasks} de {totalTasks} tareas completadas
            </p>
          )}
        </header>

        {error && (
          <div className="error">
            {error}
            <button 
              onClick={() => setError(null)}
              style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="success">
            {success}
            <button 
              onClick={() => setSuccess(null)}
              style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        <TaskForm onSubmit={handleCreateTask} />

        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          loading={loading}
        />

        {showModal && editingTask && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Editar Tarea</h2>
                <button className="close-btn" onClick={handleCancelEdit}>
                  ✕
                </button>
              </div>
              <TaskForm
                initialData={editingTask}
                onSubmit={handleUpdateTask}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
