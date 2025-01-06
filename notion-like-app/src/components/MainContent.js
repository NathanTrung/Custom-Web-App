import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent = () => {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar className="bg-blue-500" />
  
    {/* Main Content */}
    <div className="flex-1 bg-red-500 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6 text-white">Hello, {user ? user.name : 'Guest'}!</h1>
      {weather ? (
        <p className="text-lg text-white">
          The weather in {weather.name} is {weather.weather[0].description} with a temperature of {weather.main.temp}°C.
        </p>
      ) : error ? (
        <p className="text-red-300">{error}</p>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  </div>
  
  );
};

export default MainContent;
