import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { registerUser } from '../services/apiService';

function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }
    try {
    // Kirim data ke database
    await registerUser({
      nama: formData.nama,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: 'user' // Default role for new users
    });
    navigate("/login");
  } catch (err) {
    setError(err.message || 'Gagal mendaftar. Username/email mungkin sudah digunakan.');
  }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Left Side - Logo and Title */}
        <div className="login-left">
          <img 
            src={logo} 
            alt="School Inventory" 
            className="login-logo"
          />
          <h2 className="login-title">SCHOOL INVENTORY</h2>
          <p className="login-desc">Sistem Informasi Inventaris Sekolah</p>
        </div>
        {/* Right Side - Register Form */}
        <div className="login-right">
          <h2 className="login-form-title">Create Account</h2>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="login-input"
              placeholder="Nama Lengkap"
              required
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="login-input"
              placeholder="Username"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              placeholder="Password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="login-input"
              placeholder="Confirm Password"
              required
            />
            <button 
              type="submit"
              className="login-btn"
            >
              Register
            </button>
          </form>
          <div className="login-register">
            Sudah punya akun?
            <span
              className="login-register-link"
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;