import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Homepage = () => {
  const [user, setUser] = useState(null); // Holds the user data fetched from MongoDB
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Fetch User Details and Weather Data
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the JWT token from localStorage
        if (!token) {
          setError('User not logged in');
          return;
        }

        // Fetch user details from the backend
        const userResponse = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` }, // Pass the token in the headers
        });

        setUser(userResponse.data); // Set the user data
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Unable to fetch user details');
      }
    };

    const fetchWeather = async () => {
      try {
        const apiKey = 'b6cb2550030525248435437ce562d4bb'; // Replace with your OpenWeatherMap API key
        const city = 'Melbourne'; // Default location
        const response = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        setWeather(response.data);
      } catch (err) {
        setError('Unable to fetch weather data');
      }
    };

    fetchUserDetails();
    fetchWeather();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center pt-96 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Hello, {user ? user.name : 'Guest'}!
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
