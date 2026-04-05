import { useState, useEffect } from 'react';

export default function TaskForm({ addTask, updateTask, editingTask, setEditingTask }) {
  // Default blank task state
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Pending'
  });

  // Auto-fill form if editing
  useEffect(() => {
    if (editingTask) setTask(editingTask);
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent empty tasks just full of spaces
    if (!task.title.trim()) {
      alert("Task title cannot be empty.");
      return; 
    }

    // Trim trailing spaces before saving
    const cleanTask = {
      ...task,
      title: task.title.trim(),
      description: task.description.trim()
    };

    if (editingTask) {
      updateTask(task.id, cleanTask);
      setEditingTask(null);
    } else {
      addTask({ ...cleanTask, id: Date.now().toString() });
    }
    
    // Reset form
    setTask({ title: '', description: '', dueDate: '', priority: 'Low', status: 'Pending' });
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h5 className="card-title fw-bold text-primary mb-4">
          {editingTask ? 'Update Task Details' : 'Add New Task'}
        </h5>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium small">Task Title</label>
            <input type="text" className="form-control" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium small">Description</label>
            <textarea className="form-control" rows="3" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-medium small">Due Date</label>
              <input type="date" className="form-control" value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium small">Priority</label>
              <select className="form-select" value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1 fw-bold">
              {editingTask ? 'Update Task' : 'Save Task'}
            </button>
            {editingTask && (
              <button type="button" className="btn btn-outline-secondary fw-bold" onClick={() => { setEditingTask(null); setTask({ title: '', description: '', dueDate: '', priority: 'Low', status: 'Pending' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}