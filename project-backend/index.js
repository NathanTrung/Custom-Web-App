const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user'); // User routes
const taskRoutes = require('./routes/task'); // Task routes
const financeRoutes = require('./routes/finance'); // Finance routes
const chatRoutes = require('./routes/chat'); // Chat routes
const User = require('./models/User'); // User model

dotenv.config(); // Load environment variables
const apiKey = process.env.HUGGINGFACE_API_KEY;
console.log(apiKey);
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes); // User routes
app.use('/api', taskRoutes); // Task routes
app.use('/api/finance', financeRoutes); // Finance routes
app.use('/api/chat', chatRoutes); // Chat routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on failure
  });

// Signup Route
app.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    next(error); // Pass error to global handler
  }
});

// Login Route
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    next(error); // Pass error to global handler
  }
});

// Preload Hugging Face Model
const preloadModel = async () => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small',
      { inputs: 'Hello' },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );
    console.log('Hugging Face model preloaded', response.data);
  } catch (error) {
    console.error('Error preloading Hugging Face model:', error.response?.data || error.message);
  }
};
preloadModel();

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
