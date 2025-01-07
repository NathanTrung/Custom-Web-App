import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Get the current route

  // Logout Function
  const handleLogout = () => {
    localStorage.clear(); // Clear user data from localStorage
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
  <nav className="flex flex-col h-full">
    <h1 className="text-2xl font-bold px-6 py-8 border-b border-gray-700">Notion Clone</h1>
    <Link to="/home" className="px-6 py-4 hover:bg-gray-700">
      Home
    </Link>
    <Link to="/tasktracker" className="px-6 py-4 hover:bg-gray-700">
      Task Tracker
    </Link>
    <Link to="/financetracker" className="px-6 py-4 hover:bg-gray-700">
      Finance Tracker
    </Link>
    <Link to="/chatbot" className="px-6 py-4 hover:bg-gray-700">
      ChatBot
    </Link>
    <button
      onClick={handleLogout}
      className="px-6 py-4 mt-auto text-left hover:bg-red-600 bg-red-500"
    >
      Logout
    </button>
  </nav>
</div>

  );
};

export default Sidebar;
