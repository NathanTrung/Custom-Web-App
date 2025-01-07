import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import TaskTracker from './pages/TaskTracker';
import FinanceTracker from './pages/FinanceTracker';
import SignupLogin from './pages/SignupLogin';
import ChatBot from './pages/ChatBot'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check token
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<SignupLogin />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
             <div className="flex">
              <Sidebar />
              <div className="flex-1 min-h-screen bg-gray-100">
                  <Home />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasktracker"
          element={
            <PrivateRoute>
              <div className="flex">
              <Sidebar />
              <div className="flex-1 min-h-screen bg-gray-100">
                  <TaskTracker />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/financetracker"
          element={
            <PrivateRoute>
              <div className="flex">
              <Sidebar />
              <div className="flex-1 min-h-screen bg-gray-100">
                  <FinanceTracker />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <div className="flex">
              <Sidebar />
              <div className="flex-1 min-h-screen bg-gray-100">
                  <ChatBot />
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
