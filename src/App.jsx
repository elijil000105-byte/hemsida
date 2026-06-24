import React, { useState } from 'react';
import './App.css';

function App() {
  const [ipAddress, setIpAddress] = useState('10.48.80.122');
  const [port, setPort] = useState('22');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  const BACKEND_URL = 'http://10.48.80.122:8000';

  const handleConnect = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate inputs
      if (!ipAddress || !port || !username || !password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Send SSH connection request to backend
      const response = await fetch(`${BACKEND_URL}/api/ssh-connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipAddress,
          port: parseInt(port),
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Connected successfully!');
        // Save token to localStorage
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        
        // Clear fields on success
        setIpAddress('10.48.80.122');
        setPort('22');
        setUsername('');
        setPassword('');

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(data.detail || data.message || 'Connection failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Error connecting to server. Make sure the backend is running at ' + BACKEND_URL);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in
  if (token) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Welcome! 🎉</h1>
          <p style={{ color: '#b0b0b0', textAlign: 'center', marginBottom: '20px' }}>
            You are logged in
          </p>
          <button 
            className="connect-button"
            onClick={() => {
              localStorage.removeItem('authToken');
              setToken('');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login Client</h1>
        
        <form onSubmit={handleConnect}>
          <div className="form-group">
            <label htmlFor="ip-address">IP Address</label>
            <input
              id="ip-address"
              type="text"
              placeholder="10.48.80.122"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="port">Port</label>
            <input
              id="port"
              type="number"
              placeholder="22"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="connect-button"
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </form>

        <p style={{ 
          color: '#666', 
          fontSize: '12px', 
          textAlign: 'center', 
          marginTop: '20px',
          borderTop: '1px solid #333',
          paddingTop: '15px'
        }}>
          Backend URL: {BACKEND_URL}
        </p>
      </div>
    </div>
  );
}

export default App;
