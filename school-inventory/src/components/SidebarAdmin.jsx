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
    const SidebarAdmin = () => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="sidebar-admin">
        <div className="sidebar-admin-header">
            <h1>Inventaris Sekolah</h1>
        </div>
        <div className="sidebar-admin-menu">
            <p className="sidebar-admin-label">MENU</p>
            
            <Link to="/dashboard" className={`sidebar-admin-item ${isActive('/dashboard')}`}>
            <FaTachometerAlt className="sidebar-admin-icon" />
            <span>Dashboard</span>
            </Link>
            
            <Link to="/barang" className={`sidebar-admin-item ${isActive('/barang')}`}>
            <FaBox className="sidebar-admin-icon" />
            <span>Data Barang</span>
            </Link>
            
            <Link to="/kategori" className={`sidebar-admin-item ${isActive('/kategori')}`}>
            <FaLayerGroup className="sidebar-admin-icon" />
            <span>Kategori</span>
            </Link>
            
            <Link to="/peminjaman" className={`sidebar-admin-item ${isActive('/peminjaman')}`}>
            <FaHandHolding className="sidebar-admin-icon" />
            <span>Peminjaman</span>
            </Link>
            
            <Link to="/pengembalian" className={`sidebar-admin-item ${isActive('/pengembalian')}`}>
            <FaHandsHelping className="sidebar-admin-icon" />
            <span>Pengembalian</span>
            </Link>
            
            <Link to="/pengguna" className={`sidebar-admin-item ${isActive('/pengguna')}`}>
            <FaUsers className="sidebar-admin-icon" />
            <span>Pengguna</span>
            </Link>
            
            <Link to="/laporan" className={`sidebar-admin-item ${isActive('/laporan')}`}>
            <FaFileAlt className="sidebar-admin-icon" />
            <span>Laporan</span>
            </Link>
        </div>
        
        <div className="sidebar-admin-footer">
            <Link to="/logout" className="sidebar-admin-logout-btn">
            <FaSignOutAlt className="sidebar-admin-logout-icon" />
            <span className="sidebar-admin-logout-text">Logout</span>
            </Link>
        </div>
        </div>
    );
    };

    export default SidebarAdmin;