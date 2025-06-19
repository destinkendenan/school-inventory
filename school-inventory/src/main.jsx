import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/user/Dashboard.jsx'
import DaftarBarang from './pages/user/DaftarBarang.jsx'
import PeminjamanSaya from './pages/user/PeminjamanSaya.jsx'
import Pengembalian from './pages/user/Pengembalian.jsx'
import Pengguna from './pages/admin/Pengguna.jsx'
import Laporan from './pages/admin/Laporan.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Laporan />
  </StrictMode>,
)
