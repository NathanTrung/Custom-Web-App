import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData);

      if (response.data.token) {
        // Save JWT token to localStorage
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        navigate('/home'); // Redirect to your application
      } else {
        alert(response.data.message);
        setIsLogin(true); // Switch to login after signup
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? 'Login' : 'Signup'}</h1>
      <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required={!isLogin}
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 ml-2 hover:underline"
        >
          {isLogin ? 'Signup' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default SignupLogin;
