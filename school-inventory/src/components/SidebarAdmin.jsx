import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
FaTachometerAlt, 
FaBox, 
FaLayerGroup, 
FaHandHolding, 
FaHandsHelping,
FaUsers,
FaFileAlt,
FaSignOutAlt
} from 'react-icons/fa';
import "./SidebarAdmin.css";
import { useAuth } from '../context/AuthContext';

const SidebarAdmin = () => {
const location = useLocation();
const { logout } = useAuth();

const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
};

const handleLogout = () => {
    logout();
};

return (
    <div className="sidebar-admin">
    <div className="sidebar-admin-header">
        <h1>Inventaris Sekolah</h1>
    </div>
    <div className="sidebar-admin-menu">
        <p className="sidebar-admin-label">MENU</p>
        
        <Link to="/admin/dashboard" className={`sidebar-admin-item ${isActive('/admin/dashboard')}`}>
        <FaTachometerAlt className="sidebar-admin-icon" />
        <span>Dashboard</span>
        </Link>
        
        <Link to="/admin/barang" className={`sidebar-admin-item ${isActive('/admin/barang')}`}>
        <FaBox className="sidebar-admin-icon" />
        <span>Data Barang</span>
        </Link>
        
        <Link to="/admin/kategori" className={`sidebar-admin-item ${isActive('/admin/kategori')}`}>
        <FaLayerGroup className="sidebar-admin-icon" />
        <span>Kategori</span>
        </Link>
        
        <Link to="/admin/peminjaman" className={`sidebar-admin-item ${isActive('/admin/peminjaman')}`}>
        <FaHandHolding className="sidebar-admin-icon" />
        <span>Peminjaman</span>
        </Link>
        
        <Link to="/admin/pengguna" className={`sidebar-admin-item ${isActive('/admin/pengguna')}`}>
        <FaUsers className="sidebar-admin-icon" />
        <span>Pengguna</span>
        </Link>
        
        <Link to="/admin/laporan" className={`sidebar-admin-item ${isActive('/admin/laporan')}`}>
        <FaFileAlt className="sidebar-admin-icon" />
        <span>Laporan</span>
        </Link>
    </div>
    
    <div className="sidebar-admin-footer">
        <Link to="/logout" className="sidebar-admin-logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="sidebar-admin-logout-icon" />
        <span className="sidebar-admin-logout-text">Logout</span>
        </Link>
    </div>
    </div>
);
};

export default SidebarAdmin;