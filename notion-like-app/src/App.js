import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import SignupLogin from './pages/SignupLogin';

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
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-grow bg-gray-100 p-8">
                  <Home />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/page2"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-grow bg-gray-100 p-8">
                  <Page2 />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/page3"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-grow bg-gray-100 p-8">
                  <Page3 />
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
