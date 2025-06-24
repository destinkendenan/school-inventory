import { getItems, createBorrow, getBorrows } from "../../services/apiService";
import { useState, useEffect } from "react";
import "./Dashboard.css"; // Assuming you have some styles for this component

const Dashboard = () => {
  // State untuk form peminjaman
  const [barangTersedia, setBarangTersedia] = useState([]);
  const [loadingBarang, setLoadingBarang] = useState(false);
  const [formPeminjaman, setFormPeminjaman] = useState({
    barang_id: "",
    jumlahPinjam: 1,
    tanggalKembali: "",
    catatan: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);

  const userId = localStorage.getItem("userId");

  // Fetch barang tersedia
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        setLoadingBarang(true);
        const data = await getItems();
        // Filter hanya barang yang tersedia
        const available = data.filter(item => item.tersedia > 0);
        setBarangTersedia(available);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoadingBarang(false);
      }
    };

    fetchBarang();
  }, []);

  // Fetch riwayat peminjaman
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoadingRiwayat(true);
        const allBorrows = await getBorrows();
        setRiwayat(allBorrows);
      } catch (err) {
        setRiwayat([]);
      } finally {
        setLoadingRiwayat(false);
      }
    };
    fetchRiwayat();
  }, [userId]);

  // Handle perubahan form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormPeminjaman(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit form
  const handlePeminjamanSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");
      
      // Validasi form
      if (!formPeminjaman.barang_id) {
        setFormError("Pilih barang yang akan dipinjam");
        return;
      }
      
      if (!formPeminjaman.tanggalKembali) {
        setFormError("Tanggal kembali harus diisi");
        return;
      }
      
      // Format data untuk API
      const borrowData = {
        barang_id: parseInt(formPeminjaman.barang_id),
        jumlahPinjam: parseInt(formPeminjaman.jumlahPinjam),
        tanggalKembali: new Date(formPeminjaman.tanggalKembali).toISOString(),
        catatan: formPeminjaman.catatan
      };
      
      // Kirim ke API
      await createBorrow(borrowData);
      
      // Reset form
      setFormPeminjaman({
        barang_id: "",
        jumlahPinjam: 1,
        tanggalKembali: "",
        catatan: ""
      });
      
      setFormSuccess("Permintaan peminjaman berhasil dikirim");
      
      // Refresh data barang tersedia
      const data = await getItems();
      const available = data.filter(item => item.tersedia > 0);
      setBarangTersedia(available);
      
    } catch (err) {
      console.error("Error creating borrow:", err);
      setFormError("Gagal membuat peminjaman: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSubmitting(false);
    }
  };

  const totalPeminjaman = riwayat.length;
  const sedangDipinjam = riwayat.filter(r => r.status === "Dipinjam").length;
  const sudahDikembalikan = riwayat.filter(r => r.status === "Dikembalikan").length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>
        
        {/* Kartu Metrik */}
        <div className="dashboard-summary">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-title">Total Peminjaman Saya</div>
            <div className="dashboard-summary-value">{totalPeminjaman}</div>
          </div>
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-title">Barang Sedang Dipinjam</div>
            <div className="dashboard-summary-value">{sedangDipinjam}</div>
          </div>
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-title">Barang Dikembalikan</div>
            <div className="dashboard-summary-value">{sudahDikembalikan}</div>
          </div>
        </div>
        
        <div className="dashboard-section-title">Aktivitas Terbaru</div>
        
        {/* Tabel Riwayat Peminjaman */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Riwayat Peminjaman</h2>
          <div className="overflow-x-auto">
            <table className="dashboard-history-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Tanggal Pinjam</th>
                  <th>Status</th>
                  <th>Tanggal Pengembalian</th>
                </tr>
              </thead>
              <tbody>
                {loadingRiwayat ? (
                  <tr>
                    <td colSpan={4}>Memuat data...</td>
                  </tr>
                ) : riwayat.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Tidak ada data peminjaman.</td>
                  </tr>
                ) : (
                  riwayat.map((item) => (
                    <tr key={item.id}>
                      <td>{item.barang?.namaBarang || item.barang?.nama || "-"}</td>
                      <td>
                        {item.tanggalPinjam
                          ? new Date(item.tanggalPinjam).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td>
                        <span className={`dashboard-status-badge dashboard-status-${item.status?.toLowerCase()}`}>
                          {item.status || "-"}
                        </span>
                      </td>
                      <td>
                        {item.tanggalKembali
                          ? new Date(item.tanggalKembali).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Form Permintaan Peminjaman */}
        <div className="dashboard-request-card">
          <h2 className="text-lg font-semibold mb-4">Permintaan Peminjaman</h2>

          {formSuccess && (
            <div className="form-message form-success">{formSuccess}</div>
          )}

          {formError && (
            <div className="form-message form-error">{formError}</div>
          )}

          <form className="dashboard-request-form" onSubmit={handlePeminjamanSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label>
                  Nama Barang
                  <select
                    name="barang_id"
                    value={formPeminjaman.barang_id}
                    onChange={handleFormChange}
                    disabled={loadingBarang || submitting}
                  >
                    <option value="">-- Pilih Barang --</option>
                    {barangTersedia.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.namaBarang} - Tersedia: {item.tersedia}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Jumlah Barang
                  <input
                    type="number"
                    name="jumlahPinjam"
                    min="1"
                    max={formPeminjaman.barang_id ?
                      barangTersedia.find(i => i.id === parseInt(formPeminjaman.barang_id))?.tersedia || 1
                      : 1}
                    value={formPeminjaman.jumlahPinjam}
                    onChange={handleFormChange}
                    disabled={submitting}
                  />
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label>
                Tanggal Pengembalian
                <input
                  type="date"
                  name="tanggalKembali"
                  value={formPeminjaman.tanggalKembali}
                  onChange={handleFormChange}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={submitting}
                />
              </label>
            </div>
            <div className="mb-4">
              <label>
                Catatan (Opsional)
                <textarea
                  name="catatan"
                  value={formPeminjaman.catatan}
                  onChange={handleFormChange}
                  rows="3"
                  disabled={submitting}
                ></textarea>
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={submitting || loadingBarang}
              >
                {submitting ? "Memproses..." : "Ajukan Peminjaman"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;