// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cek token saat aplikasi dimuat
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch user profile data
          const response = await fetch(API_ENDPOINTS.USERS.GET_PROFILE, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            console.log("User data loaded:", userData); // Debug log
          } else {
            // Token tidak valid, hapus dari localStorage
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      console.log("Login successful, token received"); // Debug log

      // Fetch user data after login
      const userResponse = await fetch(API_ENDPOINTS.USERS.GET_PROFILE, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("User profile fetched:", userData); // Debug log
        
        // Penting: Set user terlebih dahulu
        setUser(userData);
        
        // Tambahkan delay singkat untuk memastikan state terupdate
        setTimeout(() => {
          // Redirect based on role
          if (userData.role === 'admin') {
            console.log("Navigating to admin dashboard"); // Debug log
            navigate('/admin/dashboard');
          } else {
            console.log("Navigating to user dashboard"); // Debug log
            navigate('/user/dashboard');
          }
          setLoading(false);
        }, 100);
        
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    console.log("isAuthenticated called, user:", user); // Debug log
    return !!user;
  };
  
  // Check if user is admin
  const isAdmin = () => {
    console.log("isAdmin called, user role:", user?.role); // Debug log
    return user?.role === 'admin';
  };

  const authContextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};