import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 
    
    // Catch empty spaces
    if (!username.trim() || !password.trim()) return;

    // Pull mock DB
    const registeredUsers = JSON.parse(localStorage.getItem('appUsers')) || {};

    if (isSignUp) {
      if (registeredUsers[username]) {
        setError('Username already exists! Please switch to Log In.');
        return;
      }
      
      // Register and auto-login
      registeredUsers[username] = password;
      localStorage.setItem('appUsers', JSON.stringify(registeredUsers));
      localStorage.setItem('currentUser', username);
      onLogin(username);
      
    } else {
      // Validate login
      if (!registeredUsers[username]) {
        setError('Account not found! Please Sign Up first.');
        return;
      }
      if (registeredUsers[username] !== password) {
        setError('Incorrect password! Please try again.');
        return;
      }
      
      // Success
      localStorage.setItem('currentUser', username);
      onLogin(username);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center fade-in-animation">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center text-primary mb-4">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        
        <div className="text-center text-muted small">
          {isSignUp ? 'Already have an account?' : 'Need an account?'} 
          <button 
            className="btn btn-link btn-sm p-0 ms-1" 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          >
            {isSignUp ? 'Log in here' : 'Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
}