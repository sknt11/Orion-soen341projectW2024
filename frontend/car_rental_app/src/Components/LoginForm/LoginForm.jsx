import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import { jwtDecode } from "jwt-decode";
import { FaUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', {
        username: username,
        password: password,
      });

      const { token } = response.data; // Get token from response

      if (token) {
        console.log("Token:", token);
        localStorage.setItem('token', token); // Store the token

        const decoded = jwtDecode(token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', decoded.isAdmin ? 'true' : 'false'); 

        navigate('/browse'); // Redirect to the browse page on successful login
      }
    } catch (err) {
      setErrorMessage("Login failed. Try again or register");
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="input-box">
          <input 
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon"/>
        </div>

        <div className="input-box">
          <input 
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CiLock className="icon"/>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
