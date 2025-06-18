import React, { useState } from "react";
import "../../index.css";

const dataKategori = [
  { kategori: "Alat", jumlah: 50 },
  { kategori: "Buku", jumlah: 40 },
  { kategori: "Olahraga", jumlah: 60 },
  { kategori: "Alat", jumlah: 50 },
  { kategori: "Alat", jumlah: 50 },
  { kategori: "Alat", jumlah: 50 },
  { kategori: "Alat", jumlah: 50 },
  { kategori: "Alat", jumlah: 50 },
];

const Kategori = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = dataKategori.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(dataKategori.length / itemsPerPage);

  return (
    <div className="kategori-admin-wrapper">
      <div className="kategori-admin-container-full">
        <div className="kategori-admin-header">
          <h2 className="kategori-admin-title kategori-admin-title-blue">
            Kategori
          </h2>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </div>
        <div className="kategori-admin-card">
          <div className="kategori-admin-card-header">
            <span className="kategori-admin-card-title">Daftar Kategori</span>
            <button className="kategori-admin-btn-tambah">
              Tambah Kategori
            </button>
          </div>
          <div className="kategori-admin-table-wrapper">
            <table className="kategori-admin-table kategori-admin-table-blue">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kategori</th>
                  <th>Jumlah Barang</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{indexOfFirst + idx + 1}</td>
                    <td>{item.kategori}</td>
                    <td className="text-center">{item.jumlah}</td>
                    <td className="text-center">
                      <button className="kategori-admin-btn-aksi" title="Edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="kategori-admin-btn-aksi"
                        title="Hapus"
                        style={{
                          marginLeft: "8px",
                          color: "#d32f2f",
                          borderColor: "#d32f2f",
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="kategori-admin-pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="kategori-admin-pagination-btn"
              >
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`kategori-admin-pagination-btn${
                    currentPage === i + 1 ? " active" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="kategori-admin-pagination-btn"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kategori;
