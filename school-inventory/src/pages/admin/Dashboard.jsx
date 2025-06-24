import React, { useState, useEffect } from "react";
import "../../index.css";
import "./Dashboard.css"; // Import CSS styles
import {
  getItems,
  getBorrows,
  getCategories,
  getUsers,
} from "../../services/apiService";

const DashboardAdmin = () => {
  // State untuk menyimpan data dari database
  const [totalBarang, setTotalBarang] = useState(0);
  const [totalPeminjaman, setTotalPeminjaman] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [totalPengguna, setTotalPengguna] = useState(0);

  const [latestBorrows, setLatestBorrows] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari database
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch semua data yang diperlukan
        const itemsData = await getItems();
        const borrowsData = await getBorrows();
        const categoriesData = await getCategories();
        const usersData = await getUsers();

        console.log("Dashboard data:", {
          itemsData,
          borrowsData,
          categoriesData,
          usersData,
        });

        // Set total counts
        setTotalBarang(itemsData.length || 0);
        setTotalPeminjaman(borrowsData.length || 0);
        setTotalKategori(categoriesData.length || 0);

        // Filter out admin users untuk total pengguna
        const nonAdminUsers = usersData.filter((user) => {
          const role = (user.role || "").toLowerCase();
          return role !== "admin";
        });
        setTotalPengguna(nonAdminUsers.length || 0);

        // Process latest borrows
        const formattedBorrows = [];
        if (Array.isArray(borrowsData)) {
          // Sort by date descending (newest first)
          const sortedBorrows = [...borrowsData].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.tanggalPinjam || 0);
            const dateB = new Date(b.createdAt || b.tanggalPinjam || 0);
            return dateB - dateA;
          });

          // Take the 3 latest borrows
          const latestThreeBorrows = sortedBorrows.slice(0, 3);

          for (const borrow of latestThreeBorrows) {
            try {
              const barangName = borrow.barang?.namaBarang || "Unknown Item";

              // Format time
              let time = "";
              try {
                const date = new Date(borrow.createdAt || borrow.tanggalPinjam);
                time = date.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } catch (e) {
                console.warn("Error parsing borrow date:", e);
                time = "??:??";
              }

              formattedBorrows.push(`Peminjaman Terakhir: ${barangName} - ${time}`);
            } catch (err) {
              console.error("Error formatting borrow:", err);
            }
          }
        }
        setLatestBorrows(
          formattedBorrows.length > 0
            ? formattedBorrows
            : ["Tidak ada peminjaman terbaru"]
        );

        // Process latest items
        const formattedItems = [];
        if (Array.isArray(itemsData)) {
          // Sort by date descending (newest first)
          const sortedItems = [...itemsData].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.updated_at || 0);
            const dateB = new Date(b.createdAt || b.updated_at || 0);
            return dateB - dateA;
          });

          // Take the 3 latest items
          const latestThreeItems = sortedItems.slice(0, 3);

          // Untuk barang (items)
          for (const item of latestThreeItems) {
            try {
              const itemName = item.namaBarang || "Unknown Item";
              const jumlah = item.jumlah || 0;
              const tersedia = item.tersedia || 0;
              const infoStr = `stok: ${tersedia}/${jumlah}`;
              formattedItems.push(`${itemName} - ${infoStr}`);
            } catch (err) {
              console.error("Error formatting item:", err);
            }
          }
        }
        setLatestItems(
          formattedItems.length > 0
            ? formattedItems
            : ["Tidak ada barang terbaru"]
        );

        // Process latest users
        const formattedUsers = [];
        if (Array.isArray(usersData)) {
          // Filter out admin users
          const nonAdminUsers = usersData.filter((user) => {
            const role = (user.role || "").toLowerCase();
            return role !== "admin";
          });

          // Sort by ID (assume newer users have higher IDs)
          const sortedUsers = [...nonAdminUsers].sort((a, b) => {
            // Sort by ID if available, or any other numeric property
            return (b.id || 0) - (a.id || 0);
          });

          // Take the 3 latest users
          const latestThreeUsers = sortedUsers.slice(0, 3);

          // Untuk pengguna (users)
          for (const user of latestThreeUsers) {
            try {
              const userName = user.nama || user.username || "Unknown User";
              // Hapus baris berikut:
              // const role = user.role || "pengguna";

              // Hapus format dengan role, hanya tampilkan username saja
              formattedUsers.push(userName);
            } catch (err) {
              console.error("Error formatting user:", err);
            }
          }
        }
        setLatestUsers(
          formattedUsers.length > 0
            ? formattedUsers
            : ["Tidak ada pengguna baru"]
        );

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-admin-main-bg">
      <div className="dashboard-admin-container">
        {/* Header */}
        <header className="dashboard-admin-header">
          <div className="dashboard-admin-header-content">
            <h1 className="dashboard-admin-title">Dashboard</h1>
            <p className="dashboard-admin-subtitle">Welcome back, Admin!</p>
          </div>
        </header>

        {/* Loading state */}
        {loading ? (
          <div className="dashboard-admin-loading">
            <p>Memuat data dashboard...</p>
          </div>
        ) : error ? (
          <div className="dashboard-admin-error">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Cards Section */}
            <section className="dashboard-admin-cards-wrapper">
              <div className="dashboard-admin-cards-row">
                {[
                  {
                    label: "Total Barang",
                    value: totalBarang,
                    icon: "📦",
                    color: "#4CAF50",
                  },
                  {
                    label: "Total Peminjaman",
                    value: totalPeminjaman,
                    icon: "🗳️",
                    color: "#2196F3",
                  },
                  {
                    label: "Total Kategori",
                    value: totalKategori,
                    icon: "📋",
                    color: "#FF9800",
                  },
                  {
                    label: "Total Pengguna",
                    value: totalPengguna,
                    icon: "👥",
                    color: "#9C27B0",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="dashboard-admin-card"
                    style={{ borderLeft: `4px solid ${card.color}` }}
                  >
                    <div
                      className="dashboard-admin-card-icon"
                      style={{
                        backgroundColor: `${card.color}20`,
                        marginRight: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {card.icon}
                    </div>
                    <div className="dashboard-admin-card-content">
                      <div className="dashboard-admin-card-label">{card.label}</div>
                      <div className="dashboard-admin-card-value">{card.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sections */}
            <h2
              className="dashboard-activity-title"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#1a237e",
                marginBottom: "1.5rem",
                marginTop: "2.5rem",
              }}
            >
              Aktivitas Terbaru
            </h2>
            <section className="dashboard-admin-sections">
              {[
                {
                  title: "Peminjaman Terakhir",
                  icon: <i className="fa-solid fa-clock"></i>,
                  items: latestBorrows,
                },
                {
                  title: "Barang Baru Ditambahkan",
                  icon: <i className="fa-solid fa-box"></i>,
                  items: latestItems,
                  split: " - ",
                },
                {
                  title: "User Baru Bergabung",
                  icon: <i className="fa-solid fa-user-plus"></i>,
                  items: latestUsers,
                  split: " - ",
                },
              ].map((section, index) => (
                <div key={index} className="dashboard-admin-section">
                  <div className="dashboard-section-header">
                    <span className="dashboard-section-icon">{section.icon}</span>
                    <span className="dashboard-admin-section-title">
                      {section.title}
                    </span>
                  </div>
                  <ul className="dashboard-section-list">
                    {section.items.map((item, idx) => {
                      let name = item;
                      let time = "";
                      if (section.split && item.includes(section.split)) {
                        [name, time] = item.split(section.split);
                      } else if (item.includes(": ")) {
                        [name, time] = item.split(": ");
                      }
                      return (
                        <li key={idx}>
                          <span className="dashboard-section-item-name">
                            {name}
                          </span>
                          <span className="dashboard-section-item-time">
                            {time}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
