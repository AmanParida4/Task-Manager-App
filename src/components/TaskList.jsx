export default function TaskList({ tasks, requestDelete, toggleStatus, setEditingTask, handleReorder }) {
  if (tasks.length === 0) return <div className="alert alert-info shadow-sm mt-3">No tasks found. Enjoy your day!</div>;

  return (
    <div className="row mt-3">
      {tasks.map(task => (
        <div 
          key={task.id} 
          className="col-12 mb-3"
          draggable="true"
          onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('taskId');
            handleReorder(draggedId, task.id);
          }}
          style={{ cursor: 'grab' }}
        >
          <div className={`card shadow-sm ${task.status === 'Completed' ? 'border-success opacity-75' : ''}`}>
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-3">
              
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-3 mb-1">
                  <h5 className={`card-title mb-0 fw-bold ${task.status === 'Completed' ? 'text-decoration-line-through text-muted' : ''}`}>
                    {task.title}
                  </h5>
                  <span className={`badge rounded-pill ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-success'}`}>{task.priority}</span>
                  <span className={`badge rounded-pill ${task.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>{task.status}</span>
                </div>
                {task.description && <p className="card-text text-muted small mb-1">{task.description}</p>}
                <small className="text-muted fw-medium"><i className="bi bi-calendar-event me-1"></i>Due: {task.dueDate}</small>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className={`btn btn-icon-rounded ${task.status === 'Completed' ? 'btn-secondary' : 'btn-success'}`} 
                  onClick={() => toggleStatus(task.id)} title={task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                >
                  <i className={`bi ${task.status === 'Completed' ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}`}></i>
                </button>
                <button className="btn btn-icon-rounded btn-outline-primary" onClick={() => setEditingTask(task)} title="Edit Task">
                  <i className="bi bi-pencil-fill"></i>
                </button>
                {/* Triggers the Custom Modal */}
                <button className="btn btn-icon-rounded btn-outline-danger" onClick={() => requestDelete(task.id)} title="Delete Task">
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}