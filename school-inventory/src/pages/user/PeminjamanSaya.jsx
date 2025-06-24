import React, { useEffect, useState } from "react";
import { getBorrows } from "../../services/apiService";
import "./PeminjamanSaya.css";

const PeminjamanSaya = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allBorrows = await getBorrows();
        setPeminjaman(allBorrows);
        setError(null);
      } catch (err) {
        setError("Gagal memuat data peminjaman");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Helper untuk format tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const hari = date.getDate();
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][date.getMonth()];
    const tahun = date.getFullYear();
    return `${hari} ${bulan} ${tahun}`;
  };

  return (
    <div className="peminjaman-saya-container">
      <div className="peminjaman-saya-card">
        <h1 className="peminjaman-saya-title">Peminjaman Saya</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Daftar Peminjaman
          </h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="peminjaman-saya-empty">Memuat data peminjaman...</div>
          ) : error ? (
            <div className="peminjaman-saya-empty text-red-500">{error}</div>
          ) : (
            <table className="peminjaman-saya-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Jumlah Barang</th>
                  <th>Tanggal Pengajuan</th>
                  <th>Tanggal Kembali</th>
                  <th>Catatan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {peminjaman.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="peminjaman-saya-empty">
                      Tidak ada data peminjaman.
                    </td>
                  </tr>
                ) : (
                  peminjaman.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        {item.barang?.namaBarang || item.barang?.nama || "-"}
                      </td>
                      <td>{item.barang?.kategori || "-"}</td>
                      <td>{item.jumlahPinjam || 1}</td>
                      <td>
                        {formatDate(item.tanggalPinjam || item.createdAt)}
                      </td>
                      <td>{formatDate(item.tanggalKembali)}</td>
                      <td>{item.catatan || "-"}</td>
                      <td>
                        <span
                          className={`status-badge status-${item.status}`}
                        >
                          {item.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeminjamanSaya;