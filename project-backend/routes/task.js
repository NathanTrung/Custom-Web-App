const express = require('express');
const Task = require('../models/Task'); // Import the Task model
const { authenticateToken } = require('./middleware'); // Middleware for JWT authentication
const router = express.Router();

// Create a new task
router.post('/tasks', authenticateToken, async (req, res) => {
    try {
      const { title, description, dueDate, priority, status, category } = req.body;
      const task = new Task({
        title,
        description,
        dueDate,
        priority,
        status,
        category,
        user: req.user.userId,
      });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update an existing task
  router.put('/tasks/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, dueDate, priority, status, category, isCompleted } = req.body;
      const task = await Task.findOneAndUpdate(
        { _id: id, user: req.user.userId },
        { title, description, dueDate, priority, status, category, isCompleted },
        { new: true }
      );
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Get tasks for the logged-in user
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a task
router.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
