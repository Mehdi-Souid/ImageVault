import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../styles/Signin.css';

const SignIn = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(''); // Clear previous messages on submit

    try {
      const response = await authService.signIn(username, password);
      setMessage(response.message || 'Sign-in successful!');

      // Optionally, save other user info to localStorage if needed
      localStorage.setItem('userId', response.user._id);
      localStorage.setItem('username', response.user.username); // Example: saving username

      setIsAuthenticated(true); // Set the user as authenticated

      navigate('/gallery'); // Redirect to the gallery page
    } catch (error) {
      // In case of network or server errors, handle gracefully
      setMessage(error.response?.data?.error || 'Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>} {/* Display success or error message */}
    </div>
  );
};

export default SignIn;
