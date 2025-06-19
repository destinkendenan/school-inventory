import React, { useState } from "react";
import "../../index.css";

const dataBarang = [
  {
    nama: "Proyektor",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "papan Tulis",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "Meja",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "Kursi",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "Mikroskop",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "Kabel",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "Speaker",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "Spidol",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "colokan mata 4",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
  {
    nama: "kabel HDMI",
    kategori: "Alat",
    jumlah: 50,
    tersedia: 40,
    dipinjam: 10,
  },
];

const DataBarang = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Hitung data yang akan ditampilkan
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = dataBarang.slice(indexOfFirst, indexOfLast);

  // Hitung jumlah halaman
  const totalPages = Math.ceil(dataBarang.length / itemsPerPage);

  return (
    <div className="data-barang-admin-wrapper">
      <div className="data-barang-admin-container-full">
        <div className="data-barang-admin-header">
          <h2 className="data-barang-admin-title data-barang-admin-title-blue">
            Data Barang
          </h2>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </div>
        <div className="data-barang-admin-card">
          <div className="data-barang-admin-card-header">
            <span className="data-barang-admin-card-title">Daftar Barang</span>
            <button className="data-barang-admin-btn-tambah">
              Tambah Barang Baru
            </button>
          </div>
          <div className="data-barang-admin-table-wrapper">
            <table className="data-barang-admin-table data-barang-admin-table-blue">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Jumlah Barang</th>
                  <th>Tersedia</th>
                  <th>Dipinjam</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((barang, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{indexOfFirst + idx + 1}</td>
                    <td>{barang.nama}</td>
                    <td>{barang.kategori}</td>
                    <td className="text-center">{barang.jumlah}</td>
                    <td className="text-center">{barang.tersedia}</td>
                    <td className="text-center">{barang.dipinjam}</td>
                    <td className="text-center">
                      <button
                        className="data-barang-admin-btn-aksi"
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="data-barang-admin-btn-aksi"
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
            <div className="data-barang-admin-pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="data-barang-admin-pagination-btn"
              >
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`data-barang-admin-pagination-btn${
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
                className="data-barang-admin-pagination-btn"
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

export default DataBarang;
