import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Lock } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Hardcoded Admin Bypass
    if (username === 'admin' && password === '1022') {
      localStorage.setItem('adminBypass', 'true');
      window.location.href = '/admin'; // Force reload to update layout
      return;
    }

    try {
      // If not using the hardcoded credentials, try Supabase auth (assuming username is an email)
      if (username.includes('@')) {
        await login(username, password);
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-login-logo">F</div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Sign in to manage your store</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label htmlFor="admin-username">Username</label>
            <input 
              type="text" 
              id="admin-username" 
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <div className="admin-input-group">
            <label htmlFor="admin-password">Password</label>
            <input 
              type="password" 
              id="admin-password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                <Lock size={18} />
                Sign In Securely
              </>
            )}
          </button>
        </form>

        <Link to="/" className="admin-back-link">
          <ArrowLeft size={16} />
          Return to Storefront
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
