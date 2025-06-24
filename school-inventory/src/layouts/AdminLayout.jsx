import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <SidebarAdmin />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;