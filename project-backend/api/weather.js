const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/api/weather', async (req, res) => {
  try {
    const apiKey = 'b6cb2550030525248435437ce562d4bb'; // Replace with your key
    const city = req.query.city || 'Melbourne';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    res.status(500).json({ message: 'Unable to fetch weather data' });
  }
  
});

module.exports = router;
