import React, { useState, useEffect } from 'react';
import './CSS/login.css';
import { useNavigate } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({userType: 'users', username: '', email: '', password: '', phone: ''});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/initial`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        console.log('Login auto-triggered:', data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem("user_email", data.user_email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("userType", data.userType);
        navigate('/Home');
      } else {
        alert(`Login failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }setIsLoggingIn(false);
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
  
      if (response.status === 409) {
        alert(data.error || 'User already exists.');
      } else if (response.ok) {
        alert('Registration Successful');
          setIsActive(false);
      } else {
        alert(`Registration failed: ${data.error || 'Unknown error'}`);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    } setIsLoggingIn(false);
  };  

  useEffect(() => {
    document.body.style.backgroundColor = "#D1F1CE";
    return () => {document.body.style.backgroundColor = "";};
  }, []);
  
  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password"  name="password" value={formData.password} onChange={handleChange} required />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" className="btn" disabled={isLoggingIn}>{isLoggingIn ? "Logging In..." : "LogIn"}</button>
          <div className="role-toggle">
            <div className={`toggle-option ${formData.userType === 'users' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, userType: 'users' })}>User</div>
            <div className={`toggle-option ${formData.userType === 'agent' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, userType: 'agents' })}>Agent</div>
            <div className={`slider ${formData.userType === 'agents' ? 'right' : 'left'}`}></div>
          </div>
        </form>
      </div>

      {/* Registration */}
      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="text" placeholder="Email"  name="email" value={formData.email} onChange={handleChange} required />
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className="input-box">
            <input type="tel" name="phone" placeholder="10 digit Phone-Number" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" required/>
            <i className='bx bxs-phone'></i>
          </div>
          <button type="submit" className="btn" disabled={isLoggingIn}>{isLoggingIn ? "Registering..." : "Register"}</button>
        </form>
      </div>

      {/* Toggle */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <div className = "logoInLogin">TRENDIFY</div>
          <h2>Hello, Welcome!</h2>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
        </div>
        <div className="toggle-panel toggle-right">
          <div className = "logoInLogin">TRENDIFY</div>
          <h2>Welcome Back!</h2>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;