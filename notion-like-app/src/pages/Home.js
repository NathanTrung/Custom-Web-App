import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Homepage = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem('userName') || 'Guest'; // Retrieve name from localStorage

  // Fetch Weather Data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
        const city = 'Melbourne'; // Default location
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        setWeather(response.data);
      } catch (err) {
        setError('Unable to fetch weather data');
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center pt-96 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Hello, {userName}!
      </h1>
      {weather ? (
        <p className="text-lg">
          The weather in {weather.name} is {weather.weather[0].description} with a temperature of {weather.main.temp}°C.
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default Homepage;
