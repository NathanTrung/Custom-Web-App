const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date }, // Date and time of task completion
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'], 
      default: 'Low' 
    }, // Task priority
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    }, // Status of the task
    category: { type: String }, // Optional: Category of the task
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link task to a user
  },
  { timestamps: true }
);

// Check if the model is already compiled
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

module.exports = Task;
