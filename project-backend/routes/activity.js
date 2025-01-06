const express = require('express');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = '4d3cdbff7a5e3bfbd724d8f1f00e21632e42cc7d9bf546e3df2ebda43b0d42ee';

// Middleware to Authenticate
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Log Activity
router.post('/', authenticate, async (req, res) => {
  const { activity } = req.body;
  const newActivity = new Activity({ userId: req.userId, activity });
  await newActivity.save();
  res.status(201).json({ message: 'Activity logged' });
});

// Get User Activities
router.get('/', authenticate, async (req, res) => {
  const activities = await Activity.find({ userId: req.userId });
  res.json(activities);
});

module.exports = router;
