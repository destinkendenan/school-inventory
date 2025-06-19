import React, { useState } from 'react';

// Import logo - sesuaikan path jika perlu
import logo from '../assets/logo.png';

function Register() {
  // State untuk form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register attempt:', formData);
    
    // Validasi sederhana
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    
    // Logic pendaftaran akan ditambahkan kemudian
  };

  return (
    // <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[1200px] shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Registration Form */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-100 rounded-full text-gray-700 focus:outline-none"
                  placeholder="Username"
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-100 rounded-full text-gray-700 focus:outline-none"
                  placeholder="Email"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-100 rounded-full text-gray-700 focus:outline-none"
                  placeholder="Password"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-100 rounded-full text-gray-700 focus:outline-none"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit"
  className="w-full !bg-blue-700 hover:!bg-blue-800 text-white font-medium py-3 px-4 rounded-full transition duration-300"
>
  Register
                </button>
              </div>
            </form>
            
            {/* Login Link - Placeholder */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun? 
                <span className="ml-1 text-blue-700 hover:text-blue-800 font-medium cursor-pointer">
                  Login
                </span>
              </p>
            </div>
          </div>
          
          {/* Right Side - Logo and Title */}
          <div className="md:w-1/2 bg-white p-8 flex flex-col items-center justify-center">
            <div className="w-64 h-64 mb-4">
              <img 
                src={logo} 
                alt="School Inventory" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM0ZDM5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNlY4YTIgMiAwIDAgMC0xLTEuNzNsLTctNCBhIiBzdHJva2U9IiM1NDk1YmUiPjwvcGF0aD48cGF0aCBkPSJNMiAxOXYtMWE0LDQsMCwwLDEsNC00aDEyIiBmaWxsPSIjODhkOGE0IiBzdHJva2U9IiM4OGQ4YTQiPjwvcGF0aD48cGF0aCBkPSJNMTEgMTJIOXYuNW0xMyA0aC0xIiBzdHJva2U9IiM4OGQ4YTQiPjwvcGF0aD48cGF0aCBkPSJNMiA5djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIwIDE3Vjh2LTBhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMiA5eiIgZmlsbD0iI2FhZWFjMCIgc3Ryb2tlPSIjNTQ5NWJlIj48L3BhdGg+PC9zdmc+";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}

export default Register;