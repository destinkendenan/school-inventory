// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  console.log("ProtectedRoute: user=", user, "loading=", loading);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Cek apakah user sudah login
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, loading } = useAuth();
  
  console.log("AdminRoute: user=", user, "loading=", loading);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Cek apakah user sudah login
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  // Cek apakah user adalah admin
  if (user.role !== 'admin') {
    console.log("User is not admin, redirecting to user dashboard");
    return <Navigate to="/user/dashboard" />;
  }
  
  return <Outlet />;
};