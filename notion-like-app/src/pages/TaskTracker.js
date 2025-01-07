import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Pending',
    category: '',
  });
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Unable to fetch tasks');
      console.error(err);
    }
  };

  const addTask = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/tasks',
        newTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Low', status: 'Pending', category: '' });
      fetchTasks(); // Refresh task list
    } catch (err) {
      setError('Unable to add task');
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh task list
    } catch (err) {
      setError('Unable to delete task');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
  <h1 className="text-3xl font-bold mb-6">Task Tracker</h1>
  <div className="w-full max-w-lg bg-white p-6 shadow-md rounded-lg mb-6">
    <h2 className="text-xl font-semibold mb-4 text-center">Add a New Task</h2>
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        placeholder="Task Title"
        className="w-full border px-4 py-2 rounded"
      />
      <input
        type="text"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        placeholder="Description"
        className="w-full border px-4 py-2 rounded"
      />
      <input
        type="datetime-local"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        className="w-full border px-4 py-2 rounded"
      />
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        value={newTask.status}
        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        type="text"
        value={newTask.category}
        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        placeholder="Category (e.g., Work, Personal)"
        className="w-full border px-4 py-2 rounded"
      />
      <button
        onClick={addTask}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </div>
    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
  </div>

  <h2 className="text-2xl font-semibold mt-8 mb-4">Your Tasks</h2>
  <ul className="w-full max-w-lg space-y-4">
    {tasks.map((task) => (
      <li key={task._id} className="flex flex-col p-4 border rounded-lg bg-gray-50 shadow-sm">
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p>{task.description}</p>
        <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date'}</p>
        <p>Priority: {task.priority || 'Not specified'}</p>
        <p>Status: {task.status || 'Not specified'}</p>
        <p>Category: {task.category || 'None'}</p>
        <button
          onClick={() => deleteTask(task._id)}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
        >
          Delete Task
        </button>
      </li>
    ))}
  </ul>
</div>

  );
};

export default TaskTracker;
