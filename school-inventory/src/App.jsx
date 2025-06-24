import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import DataBarang from './pages/admin/DataBarang';
import Kategori from './pages/admin/Kategori';
import Peminjaman from './pages/admin/Peminjaman';
import Pengguna from './pages/admin/Pengguna';
import Laporan from './pages/admin/Laporan';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import DaftarBarang from './pages/user/DaftarBarang';
import PeminjamanSaya from './pages/user/PeminjamanSaya';
import UserPengembalian from './pages/user/Pengembalian';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Admin Routes with Layout */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/barang" element={<DataBarang />} />
              <Route path="/admin/kategori" element={<Kategori />} />
              <Route path="/admin/peminjaman" element={<Peminjaman />} />
              <Route path="/admin/pengguna" element={<Pengguna />} />
              <Route path="/admin/laporan" element={<Laporan />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            </Route>
          </Route>

          {/* User Routes with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/daftar-barang" element={<DaftarBarang />} />
              <Route path="/user/peminjaman-saya" element={<PeminjamanSaya />} />
              <Route path="/user/pengembalian" element={<UserPengembalian />} />
              <Route path="/user" element={<Navigate to="/user/dashboard" />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;