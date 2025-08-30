import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="task-list">
        <div className="loading">
          <p>Cargando tareas...</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="empty-state">
          <h3>No hay tareas</h3>
          <p>¡Crea tu primera tarea para comenzar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
