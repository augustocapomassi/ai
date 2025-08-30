import React from 'react';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <div>
          <h3 className={`task-title ${task.completed ? 'task-completed' : ''}`}>
            {task.title}
          </h3>
          <span className={`status-badge ${task.completed ? 'status-completed' : 'status-pending'}`}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </span>
        </div>
        <div className="task-actions">
          <button
            className={`btn ${task.completed ? 'btn-warning' : 'btn-success'}`}
            onClick={() => onToggle(task.id)}
            title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {task.completed ? '↩️' : '✅'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onEdit(task)}
            title="Editar tarea"
          >
            ✏️
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(task.id)}
            title="Eliminar tarea"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div>
          <strong>Creada:</strong> {formatDate(task.created_at)}
        </div>
        {task.updated_at !== task.created_at && (
          <div>
            <strong>Actualizada:</strong> {formatDate(task.updated_at)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
