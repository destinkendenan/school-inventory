import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DashboardAdmin from "./pages/admin/Dashboard.jsx";
import DataBarang from "./pages/admin/DataBarang.jsx";
import Kategori from "./pages/admin/Kategori.jsx";
import Peminjaman from "./pages/admin/Peminjaman.jsx";
import Pengembalian from "./pages/admin/Pengembalian.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Pengembalian />
  </StrictMode>
);
