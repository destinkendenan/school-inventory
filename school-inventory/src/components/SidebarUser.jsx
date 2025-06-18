    import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { BiGridAlt } from 'react-icons/bi';
    import { BsBox } from 'react-icons/bs';
    import { GiTakeMyMoney, GiPayMoney } from 'react-icons/gi';
    import { FiLogOut } from 'react-icons/fi';
    import './SidebarUser.css';

    const SidebarUser = () => {
    const location = useLocation();
    const { pathname } = location;

    const menuItems = [
        {
        path: '/dashboard',
        name: 'Dashboard',
        icon: <BiGridAlt size={20} />
        },
        {
        path: '/daftar-barang',
        name: 'Daftar Barang',
        icon: <BsBox size={20} />
        },
        {
        path: '/peminjaman-saya',
        name: 'Peminjaman Saya',
        icon: <GiTakeMyMoney size={20} />
        },
        {
        path: '/pengembalian',
        name: 'Pengembalian',
        icon: <GiPayMoney size={20} />
        }
    ];

    const handleLogout = () => {
        // Add logout functionality here
        console.log('Logging out...');
    };

    return (
        <div className="SidebarUser-sidebar">
        <div className="SidebarUser-header">
            <h1>Inventory</h1>
            <div className="SidebarUser-divider"></div>
            <p className="SidebarUser-menuLabel">MENU</p>
        </div>
        
        <div className="SidebarUser-menuItems">
            {menuItems.map((item, index) => (
            <Link 
                to={item.path} 
                key={index} 
                className={`SidebarUser-menuItem ${pathname === item.path ? 'SidebarUser-active' : ''}`}
            >
                <div className="SidebarUser-icon">{item.icon}</div>
                <div className="SidebarUser-label">{item.name}</div>
            </Link>
            ))}
        </div>
        
        <div className="SidebarUser-logoutContainer">
            <button className="SidebarUser-logoutButton" onClick={handleLogout}>
            <FiLogOut size={20} color="red" />
            <span className="SidebarUser-logoutText">Logout</span>
            </button>
        </div>
        </div>
    );
    };

    export default SidebarUser;