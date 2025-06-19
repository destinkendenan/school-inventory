import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// Import components
import SidebarAdmin from './components/SidebarAdmin'
import SidebarUser from './components/SidebarUser'

// Import pages - Authentication
import Login from './pages/Login'
import Register from './pages/Register'

// Import pages - Admin
import AdminDashboard from './pages/admin/Dashboard'
import DataBarang from './pages/admin/DataBarang'
import Kategori from './pages/admin/Kategori'
import Peminjaman from './pages/admin/Peminjaman'
import AdminPengembalian from './pages/admin/Pengembalian'
import Pengguna from './pages/admin/Pengguna'
import Laporan from './pages/admin/Laporan'

// Import pages - User
import UserDashboard from './pages/user/Dashboard'
import DaftarBarang from './pages/user/DaftarBarang'
import PeminjamanSaya from './pages/user/PeminjamanSaya'
import UserPengembalian from './pages/user/Pengembalian'

function App() {
  // In a real app, you would have an auth state to check if user is logged in and their role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'admin' or 'user'

  // Layout components
  const AdminLayout = ({ children }) => (
    <div className="flex">
      <SidebarAdmin />
      <div className="flex-1">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );

  const UserLayout = ({ children }) => (
    <div className="flex">
      <SidebarUser />
      <div className="flex-1">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );

  // Auth check HOC
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/dashboard" />;
    }
    
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Route (handled differently based on role) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {userRole === 'admin' ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : (
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            )}
          </ProtectedRoute>
        } />

        {/* Admin-specific Routes */}
        <Route path="/barang" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <DataBarang />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/kategori" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <Kategori />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/peminjaman" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <Peminjaman />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/pengguna" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <Pengguna />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/laporan" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <Laporan />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* User-specific Routes */}
        <Route path="/daftar-barang" element={
          <ProtectedRoute allowedRole="user">
            <UserLayout>
              <DaftarBarang />
            </UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/peminjaman-saya" element={
          <ProtectedRoute allowedRole="user">
            <UserLayout>
              <PeminjamanSaya />
            </UserLayout>
          </ProtectedRoute>
        } />

        {/* Shared Route with Different Components */}
        <Route path="/pengembalian" element={
          <ProtectedRoute>
            {userRole === 'admin' ? (
              <AdminLayout>
                <AdminPengembalian />
              </AdminLayout>
            ) : (
              <UserLayout>
                <UserPengembalian />
              </UserLayout>
            )}
          </ProtectedRoute>
        } />

        {/* Redirect root to login or dashboard based on auth state */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />

        {/* Catch-all route for 404 */}
        <Route path="*" element={
          isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  )
}

export default App