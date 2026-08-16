import React, { useState } from 'react'
import './AuthModal.css'
import logoImg from '../../assets/image.png'

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <img src={logoImg} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Login with your phone number' : 'Register to get started'}
          </p>
        </div>

        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your full name" required />
            </div>
          )}
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 00000 00000" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" required />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
