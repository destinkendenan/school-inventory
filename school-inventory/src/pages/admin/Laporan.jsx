import React, { useState, useEffect } from "react";
import "../../index.css";
import "./Laporan.css";
import { getBorrows } from "../../services/apiService";

const Laporan = () => {
  // State untuk data
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk filter
  const [selectedBulanPeminjaman, setSelectedBulanPeminjaman] = useState("");
  const [selectedTahunPeminjaman, setSelectedTahunPeminjaman] = useState("");

  // Fungsi untuk mengambil data peminjaman
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ambil data peminjaman
        const borrowsData = await getBorrows();
        console.log("Raw borrows data:", borrowsData);
        
        // Format data peminjaman
        const formattedBorrows = [];
        
        if (Array.isArray(borrowsData)) {
          for (const item of borrowsData) {
            try {
              // Skip item yang null/undefined
              if (!item) continue;
              
              // Format tanggal
              let tanggalObj = new Date();
              try {
                if (item.tanggalPinjam) {
                  tanggalObj = new Date(item.tanggalPinjam);
                } else if (item.createdAt) {
                  tanggalObj = new Date(item.createdAt);
                }
              } catch (e) {
                console.warn("Error parsing date:", e);
              }
              
              const hari = tanggalObj.getDate();
              const bulan = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
              ][tanggalObj.getMonth()];
              const tahun = tanggalObj.getFullYear();
              const tanggalFormatted = `${hari} ${bulan} ${tahun}`;
              
              const bulanAngka = (tanggalObj.getMonth() + 1).toString().padStart(2, '0');
              const tahunAngka = tahun.toString();
              
              // Get peminjam data
              let peminjamName = "N/A";
              if (item.peminjam) {
                peminjamName = item.peminjam.nama || item.peminjam.username || "N/A";
              }
              
              // Get barang data
              const barang = item.barang || {};
              const kategori = barang.kategori || {};
              
              // Buat objek dasar
              const baseObj = {
                id: item.id,
                peminjam: peminjamName,
                barang: barang.namaBarang || "N/A",
                kategori: kategori.nama || "Lainnya",
                jumlah: item.jumlahPinjam || 1,
                tanggal: tanggalFormatted,
                bulanAngka,
                tahunAngka,
                status: item.status || "menunggu"
              };
              
              // Semua peminjaman masuk ke formattedBorrows
              formattedBorrows.push(baseObj);
            } catch (err) {
              console.error("Error formatting borrow item:", err, item);
            }
          }
        }
        
        setPeminjaman(formattedBorrows);
        setError(null);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Gagal memuat data laporan: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter data peminjaman
  const filteredPeminjaman = peminjaman.filter((item) => {
    if (!selectedBulanPeminjaman && !selectedTahunPeminjaman) return true;
    
    if (selectedBulanPeminjaman && !selectedTahunPeminjaman) {
      return item.bulanAngka === selectedBulanPeminjaman;
    }
    
    if (!selectedBulanPeminjaman && selectedTahunPeminjaman) {
      return item.tahunAngka === selectedTahunPeminjaman;
    }
    
    return item.bulanAngka === selectedBulanPeminjaman && item.tahunAngka === selectedTahunPeminjaman;
  });
  
  // Handle cetak laporan
  const handleCetakLaporan = () => {
    window.print();
  };

  // Dapatkan tanggal hari ini untuk header laporan
  const getTodayDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('id-ID', options);
  };

  return (
    <div className="laporan-admin-wrapper">
      <div className="laporan-admin-container-full">
        {/* Header yang hanya tampil di layar (tidak di cetak) */}
        <div className="laporan-admin-header screen-only">
          <h2 className="laporan-admin-title laporan-admin-title-blue">
            Laporan
          </h2>
        </div>

        {/* Header khusus untuk cetakan */}
        <div className="print-container print-only">
          <div className="print-header">
            <div className="print-header-logo">
              <img src="/logo-sekolah.png" alt="Logo Sekolah" className="print-logo" />
            </div>
            <div className="print-header-text">
              <h1 className="print-title">LAPORAN PEMINJAMAN INVENTARIS</h1>
              <h2 className="print-subtitle">SEKOLAH MENENGAH KEJURUAN NEGERI</h2>
              <p className="print-address">Jl. Pendidikan No. 123, Kota Surabaya</p>
              <p className="print-date">Tanggal Cetak: {getTodayDate()}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="laporan-admin-loading">
            <p>Memuat data laporan...</p>
          </div>
        ) : error ? (
          <div className="laporan-admin-error">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Laporan Peminjaman */}
            <div className="laporan-admin-card">
              <div className="laporan-admin-card-header screen-only">
                <span className="laporan-admin-card-title">Laporan Peminjaman</span>
                <div className="laporan-admin-filter">
                  <span className="laporan-admin-filter-label">Filter:</span>
                  <select 
                    className="laporan-admin-filter-select"
                    value={selectedBulanPeminjaman}
                    onChange={(e) => setSelectedBulanPeminjaman(e.target.value)}
                  >
                    <option value="">Semua Bulan</option>
                    <option value="01">Januari</option>
                    <option value="02">Februari</option>
                    <option value="03">Maret</option>
                    <option value="04">April</option>
                    <option value="05">Mei</option>
                    <option value="06">Juni</option>
                    <option value="07">Juli</option>
                    <option value="08">Agustus</option>
                    <option value="09">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                  </select>
                  <select 
                    className="laporan-admin-filter-select"
                    value={selectedTahunPeminjaman}
                    onChange={(e) => setSelectedTahunPeminjaman(e.target.value)}
                  >
                    <option value="">Semua Tahun</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>
              
              {/* Informasi filter untuk cetakan */}
              <div className="print-filter-info print-only">
                <p>
                  <strong>Periode:</strong> {
                    selectedBulanPeminjaman ? 
                    `Bulan ${
                      ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                      "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                      [parseInt(selectedBulanPeminjaman) - 1]
                    }` : "Semua Bulan"
                  } 
                  {selectedTahunPeminjaman ? ` Tahun ${selectedTahunPeminjaman}` : ""}
                </p>
                <p><strong>Total Data:</strong> {filteredPeminjaman.length} peminjaman</p>
              </div>
              
              <div className="laporan-admin-table-wrapper">
                {filteredPeminjaman.length === 0 ? (
                  <div className="laporan-admin-no-data">
                    <div className="laporan-admin-no-data-icon">
                      ⚠️
                    </div>
                    <h3 className="laporan-admin-no-data-title">
                      Data Tidak Ditemukan
                    </h3>
                    <p className="laporan-admin-no-data-message">
                      Tidak ada data peminjaman untuk periode yang dipilih.
                    </p>
                  </div>
                ) : (
                  <table className="laporan-admin-table laporan-admin-table-blue">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Peminjam</th>
                        <th>Nama Barang</th>
                        <th>Kategori</th>
                        <th>Jumlah</th>
                        <th>Tanggal Peminjaman</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPeminjaman.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td>{item.peminjam}</td>
                          <td>{item.barang}</td>
                          <td>{item.kategori}</td>
                          <td className="text-center">{item.jumlah}</td>
                          <td className="text-center">{item.tanggal}</td>
                          <td className="text-center">
                            <span className={`status-badge status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Tombol Cetak Laporan - hanya tampil di layar */}
            <div className="laporan-admin-actions screen-only">
              <button 
                className="laporan-admin-btn-cetak"
                onClick={handleCetakLaporan}
              >
                Cetak Laporan
              </button>
            </div>
            
            {/* Footer khusus untuk cetakan */}
            <div className="print-footer">
              <div className="print-signature">
                <p className="print-city">Surabaya, {getTodayDate()}</p>
                <p className="print-role">Kepala Sekolah</p>
                <div className="print-signature-space"></div>
                <p className="print-name">Dra. Nama Kepala Sekolah</p>
                <p className="print-nip">NIP. 196X0X0X 198X0X 1 00X</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Laporan;