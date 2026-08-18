import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        onClose();
      } else {
        await register(email, password);
        // After successful registration, we can just switch back to login mode or close
        // but typically registration logs them in or tells them to login. 
        // Our AuthContext register function shows a toast, so let's switch to login view.
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      // Error is handled in AuthContext via toasts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{isLogin ? 'Sign In Required' : 'Create an Account'}</h2>
          <p>
            {isLogin 
              ? 'Please sign in to continue.' 
              : 'Sign up to shop and manage your orders.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading 
              ? 'Please wait...' 
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <>
              Don't have an account? 
              <button onClick={() => setIsLogin(false)}>Create one</button>
            </>
          ) : (
            <>
              Already have an account? 
              <button onClick={() => setIsLogin(true)}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
