import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';

function Dashboard({ currentUser, onLogout }) {
  const storageKey = `tasks_${currentUser}`;

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(storageKey);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [isFirstLoad, setIsFirstLoad] = useState(() => !localStorage.getItem(storageKey));
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (isFirstLoad) fetchSampleTasks();
  }, [isFirstLoad]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);

  useEffect(() => {
    if (editingTask) setIsFormOpen(true);
  }, [editingTask]);

  const fetchSampleTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
      const apiData = await response.json();
      const pTitles = ["Review frontend architecture", "Optimize React layout shifts", "Deploy to Vercel"];
      const formattedTasks = apiData.map((item, index) => ({
        id: item.id.toString(),
        title: pTitles[index],
        description: `Sample task generated for ${currentUser}.`,
        dueDate: new Date().toISOString().split('T')[0],
        priority: index === 0 ? 'High' : 'Medium',
        status: item.completed ? 'Completed' : 'Pending'
      }));
      setTasks(formattedTasks);
    } catch (err) {
      setError("Failed to fetch initial tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = (task) => { setTasks([...tasks, task]); setIsFormOpen(false); }
  const updateTask = (id, updated) => { setTasks(tasks.map(t => t.id === id ? updated : t)); setIsFormOpen(false); }
  const toggleStatus = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t));

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setTaskToDelete(null); 
    }
  };

  const handleReorder = (draggedId, targetId) => {
    if (draggedId === targetId) return;
    const dIndex = tasks.findIndex(t => t.id === draggedId);
    const tIndex = tasks.findIndex(t => t.id === targetId);
    const newTasks = [...tasks];
    const [removed] = newTasks.splice(dIndex, 1);
    newTasks.splice(tIndex, 0, removed);
    setTasks(newTasks);
    setSortBy('custom'); 
  };

  const getProcessedTasks = () => {
    let processed = [...tasks];
    if (searchQuery) processed = processed.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterStatus !== 'All') processed = processed.filter(t => t.status === filterStatus);
    if (filterPriority !== 'All') processed = processed.filter(t => t.priority === filterPriority);
    processed.sort((a, b) => {
      if (sortBy === 'custom') return 0;
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      const pVals = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return pVals[b.priority] - pVals[a.priority];
    });
    return processed;
  };

  return (
    <>
      <div className="container-fluid py-4 px-4 px-lg-5 fade-in-animation">
        
        {/* --- HEADER --- */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom position-relative">
          <div style={{ width: '100px' }}></div>
          <h4 className="text-primary fw-bold mb-0 position-absolute start-50 translate-middle-x d-none d-sm-block">
            <i className="bi bi-check2-square me-2"></i>Task Manager
          </h4>
          <div className="d-flex align-items-center gap-4">
            <button className={`btn border-0 fs-5 p-0 ${isDarkMode ? 'text-light' : 'text-dark'}`} onClick={() => setIsDarkMode(!isDarkMode)}>
              <i className={isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'}></i>
            </button>
            <div className="dropdown">
              <div className="avatar-circle bg-primary shadow-sm" data-bs-toggle="dropdown" aria-expanded="false">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2" style={{ minWidth: '200px', borderRadius: '12px' }}>
                <li className="text-center py-3 border-bottom mb-2">
                  <div className="avatar-circle bg-primary mx-auto mb-2" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <h6 className="mb-0 fw-bold">{currentUser}</h6>
                </li>
                <li>
                  <button className="dropdown-item text-danger fw-bold rounded" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row flex-lg-nowrap overflow-hidden">
          {/* --- MAIN TASK AREA --- */}
          <div className={`task-area-transition ${isFormOpen ? 'col-xl-8 col-lg-7' : 'col-12'}`}>
            <div className="card shadow-sm mb-2 border-0">
              <div className="card-body d-flex flex-wrap align-items-end gap-3 p-3">
                
                {/* SEARCH BAR (Takes all remaining space) */}
                <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                  <label className="form-label small text-muted mb-1 fw-medium">Search Tasks</label>
                  <div className="position-relative">
                    <i className="bi bi-search position-absolute text-muted" style={{ top: '50%', left: '15px', transform: 'translateY(-50%)' }}></i>
                    <input type="text" className="form-control search-padded" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>

                {/* RIGID DROPDOWNS (Strict 140px width, no flexing) */}
                <div style={{ width: '140px' }}>
                  <label className="form-label small text-muted mb-1 fw-medium">Status</label>
                  <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All</option><option value="Pending">Pending</option><option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div style={{ width: '140px' }}>
                  <label className="form-label small text-muted mb-1 fw-medium">Priority</label>
                  <select className="form-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="All">All</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                  </select>
                </div>
                
                <div style={{ width: '140px' }}>
                  <label className="form-label small text-muted mb-1 fw-medium">Sort By</label>
                  <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="dueDate">Due Date</option><option value="priority">Priority</option><option value="custom">Drag Order</option>
                  </select>
                </div>

                {/* TOGGLE FORM BUTTON */}
                <button 
                  className={`btn ${isFormOpen ? 'btn-secondary' : 'btn-primary'} ms-auto`} 
                  style={{ height: '42px', minWidth: '42px', borderRadius: '10px' }}
                  onClick={() => { setIsFormOpen(!isFormOpen); if (isFormOpen) setEditingTask(null); }}
                >
                  <i className={`bi fs-5 ${isFormOpen ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
                </button>
              </div>
            </div>

            <TaskList tasks={getProcessedTasks()} requestDelete={setTaskToDelete} toggleStatus={toggleStatus} setEditingTask={setEditingTask} handleReorder={handleReorder} />
          </div>

          {/* --- SIDE SLIDER FORM --- */}
          {isFormOpen && (
            <div className="col-xl-4 col-lg-5 slide-in-right">
              <div className="sticky-top" style={{ top: '20px' }}>
                <TaskForm addTask={addTask} updateTask={updateTask} editingTask={editingTask} setEditingTask={setEditingTask} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {taskToDelete && (
        <div className="custom-modal-backdrop" onClick={() => setTaskToDelete(null)}>
          <div 
            className={`card custom-modal-card shadow-lg ${isDarkMode ? 'bg-dark' : 'bg-white'}`} 
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="card-body p-4 text-center">
              <div className="text-danger mb-3" style={{ fontSize: '3.5rem', lineHeight: '1' }}>
                <i className="bi bi-exclamation-circle"></i>
              </div>
              <h4 className="fw-bold mb-2">Delete Task?</h4>
              <p className="text-muted mb-4">Are you sure you want to permanently delete this task? This action cannot be undone.</p>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-light fw-bold px-4" onClick={() => setTaskToDelete(null)}>Cancel</button>
                <button className="btn btn-danger fw-bold px-4" onClick={confirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- APP WRAPPER ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser'));
  
  if (!currentUser) return <Login onLogin={setCurrentUser} />;
  
  return <Dashboard currentUser={currentUser} onLogout={() => { localStorage.removeItem('currentUser'); setCurrentUser(null); }} />;
}