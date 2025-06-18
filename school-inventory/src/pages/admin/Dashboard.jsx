import React from "react";
import "../../index.css";

const DashboardAdmin = () => {
  return (
    <div className="dashboard-admin-main-bg">
      <div className="dashboard-admin-container">
        {/* Header */}
        <header className="dashboard-admin-header">
          <div className="dashboard-admin-header-content">
            <h1 className="dashboard-admin-title">Dashboard</h1>
            <p className="dashboard-admin-subtitle">Welcome back, Admin!</p>
          </div>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </header>

        {/* Cards Section */}
        <section className="dashboard-admin-cards-wrapper">
          <div className="dashboard-admin-cards-row">
            {[
              {
                label: "Total Barang",
                value: 120,
                icon: "📦",
                color: "#4CAF50",
              },
              {
                label: "Total Peminjaman",
                value: 34,
                icon: "🗳️",
                color: "#2196F3",
              },
              {
                label: "Total Kategori",
                value: 10,
                icon: "📋",
                color: "#FF9800",
              },
              {
                label: "Total Pengguna",
                value: 15,
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
              items: [
                "Peminjaman Terakhir: Papan Tulis - 12.50",
                "Peminjaman Terakhir: Proyektor - 12.00",
                "Peminjaman Terakhir: Meja - 11.55",
              ],
            },
            {
              title: "Barang Baru Ditambahkan",
              icon: <i className="fa-solid fa-box"></i>,
              items: [
                "Mikroskop - 12.45",
                "Bola Basket - 11.48",
                "Kursi - 11.10",
              ],
              split: " - ",
            },
            {
              title: "User Baru Bergabung",
              icon: <i className="fa-solid fa-user-plus"></i>,
              items: ["Kezia - 01.20", "Destin - 12.22", "Lifsa - 12.12"],
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
      </div>
    </div>
  );
};

export default DashboardAdmin;
