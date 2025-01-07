const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');
const nodemailer = require('nodemailer');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware to verify JWT

// Get all finances for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user.userId });
    res.status(200).json(finances);
  } catch (err) {
    console.error('Error fetching finances:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new finance entry
router.post('/', authenticateToken, async (req, res) => {
    try {
      console.log('Incoming data:', req.body); // Log incoming data
      console.log('User ID:', req.user.userId); // Log user ID from JWT
  
      const { title, amount, type, category } = req.body;
  
      if (!title || !amount || !type || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const finance = new Finance({
        title,
        amount,
        type,
        category,
        user: req.user.userId,
      });
  
      await finance.save();
      res.status(201).json(finance);
    } catch (err) {
      console.error('Error adding finance entry:', err); // Log the error
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete a transaction
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const transaction = await Finance.findByIdAndDelete(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
      console.error('Error deleting transaction:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

// Send finance summary email
router.post('/email-summary', authenticateToken, async (req, res) => {
  try {
    const user = req.user; // From JWT token
    const finances = await Finance.find({ user: user.userId });

    // Generate the summary
    let incomeTotal = 0;
    let expenseTotal = 0;

    finances.forEach((entry) => {
      if (entry.type === 'Income') incomeTotal += entry.amount;
      else if (entry.type === 'Expense') expenseTotal += entry.amount;
    });

    const summary = `
      Hello ${user.name},\n
      Here's your finance summary:\n
      Total Income: $${incomeTotal.toFixed(2)}\n
      Total Expenses: $${expenseTotal.toFixed(2)}\n
      Net Savings: $${(incomeTotal - expenseTotal).toFixed(2)}\n
    `;

    // Email setup using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Add your email
        pass: process.env.EMAIL_PASS, // Add your email password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email, // User email from JWT
      subject: 'Your Finance Summary',
      text: summary,
    });

    res.status(200).json({ message: 'Summary sent to your email!' });
  } catch (err) {
    console.error('Error sending email summary:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
