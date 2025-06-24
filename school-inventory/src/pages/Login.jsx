import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Login gagal. Periksa username dan password Anda.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Silahkan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

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
        {/* Right Side - Login Form */}
        <div className="login-right">
          <h2 className="login-form-title">Welcome Back!</h2>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="Username"
              required
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Password"
              required
            />
            <button 
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Login'}
            </button>
          </form>
          <div className="login-register">
            Belum punya akun?
            <span
              className="login-register-link"
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer" }}
            >
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;