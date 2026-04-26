import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTaskName('');
    } catch (error) {
      console.error(error);
    }
  };

  const markCompleted = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH'
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>To-Do List</h1>
        <p>Stay organized and productive</p>
      </header>
      <main>
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <span className="task-text">{task.taskName}</span>
                {!task.completed && (
                  <button
                    className="complete-btn"
                    onClick={() => markCompleted(task._id)}
                  >
                    Mark Complete
                  </button>
                )}
                {task.completed && (
                  <span className="completed-badge">✓ Completed</span>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <footer>
        made by Atharva Zope(123B1D067)
      </footer>
    </div>
  );
}

export default App;