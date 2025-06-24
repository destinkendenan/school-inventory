import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarUser from '../components/SidebarUser';

const UserLayout = () => {
  return (
    <div>
      <SidebarUser />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;