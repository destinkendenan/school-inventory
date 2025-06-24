import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  // State untuk form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect jika user sudah login
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting");
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
      console.log("Attempting login with:", username);
      const success = await login(username, password);
      
      if (!success) {
        setError('Login gagal. Periksa username dan password Anda.');
      }
      // Jangan redirect di sini, biarkan useEffect di atas yang menangani
    } catch (err) {
      console.error("Login error:", err);
      setError('Terjadi kesalahan saat login. Silahkan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    // <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Login Form */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center mb-10">Welcome Back!</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-red-100 rounded-full text-gray-700 focus:outline-none"
                  placeholder="Username"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-red-100 rounded-full text-gray-700 focus:outline-none"
                  placeholder="Password"
                  required
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit"
                    className="w-full font-medium py-3 px-4 rounded-full text-white transition duration-300"
                    style={{ backgroundColor: '#1d4ed8', color: 'white' }}
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? 'Memproses...' : 'Login'}
                </button>
              </div>
            </form>

             {/* Register Link - Sementara dibuat sebagai teks biasa */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun? 
                <span className="ml-1 text-blue-700 hover:text-blue-800 font-medium cursor-pointer">
                  Register
                </span>
              </p>
            </div>
          </div>
          
         {/* Right Side - Logo and Title */}
          <div className="md:w-1/2 bg-white p-12 flex flex-col items-center justify-center">
            {/* Logo dengan ukuran yang lebih besar */}
            <div className="w-64 h-64 mb-6"> {/* Diubah dari w-48 h-48 */}
              <img 
                src={logo} 
                alt="School Inventory" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}

export default Login;