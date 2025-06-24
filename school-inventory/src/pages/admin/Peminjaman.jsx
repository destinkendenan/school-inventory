import React, { useState, useEffect } from "react";
import "../../index.css";
import { getBorrows, updateBorrow, getUsers, returnBorrowedItem } from "../../services/apiService";
import { API_ENDPOINTS } from "../../config/api";
import ReturnConfirm from '../../components/overlay/ReturnConfirm';

const Peminjaman = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBulan, setSelectedBulan] = useState(""); // Default semua bulan
  const [selectedTahun, setSelectedTahun] = useState(""); // Default semua tahun
  const itemsPerPage = 10;
  const [userCache, setUserCache] = useState({}); // Cache untuk menyimpan data user yang sudah diambil
  const [isReturnConfirmOpen, setIsReturnConfirmOpen] = useState(false);
  const [borrowToReturn, setBorrowToReturn] = useState(null);

  // Fungsi untuk mendapatkan user dari list users
  const getUserById = (userId, usersList) => {
    return usersList.find(user => user.id === userId) || null;
  };

  // Fetch data peminjaman dari API
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true);
        console.log("Fetching from endpoint:", API_ENDPOINTS.BORROWS.GET_ALL);
        const data = await getBorrows();
        console.log("Raw API response:", data);
        
        // Format data sesuai kebutuhan UI
        const formattedData = [];

        if (Array.isArray(data)) {
          for (const item of data) {
            console.log("Processing item:", item);
            
            try {
              // Skip undefined/null items
              if (!item) continue;
              
              // Create tanggalObj safely
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
              
              // Tambahan untuk tanggal kembali
              let tanggalKembaliFormatted = "-";
              if (item.tanggalKembali) {
                try {
                  const tanggalKembaliObj = new Date(item.tanggalKembali);
                  const hari = tanggalKembaliObj.getDate();
                  const bulan = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                  ][tanggalKembaliObj.getMonth()];
                  const tahun = tanggalKembaliObj.getFullYear();
                  tanggalKembaliFormatted = `${hari} ${bulan} ${tahun}`;
                } catch (e) {
                  console.warn("Error parsing return date:", e);
                }
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
              
              // Get peminjam data - prioritas menggunakan data relasi
              let peminjamName = "N/A";
              
              if (item.peminjam) {
                // Jika relasi sudah terbentuk dengan baik
                peminjamName = item.peminjam.nama || item.peminjam.username || item.peminjam.email;
              } else if (item.peminjam_id) {
                // Jika hanya ada peminjam_id, ambil dari cache atau fetch terpisah
                const cachedUser = userCache[item.peminjam_id];
                if (cachedUser) {
                  peminjamName = cachedUser.nama || cachedUser.username || cachedUser.email;
                } else {
                  console.log(`User data not available for peminjam_id: ${item.peminjam_id}`);
                  // Jika perlu, di sini bisa fetch data user berdasarkan peminjam_id
                }
              }
              
              // Extract barang and other properties safely
              const barang = item.barang || {};
              const kategori = barang.kategori || {};
              
              formattedData.push({
                id: item.id || Math.random().toString(36).substr(2, 9),
                peminjam: peminjamName,
                peminjam_id: item.peminjam_id || (item.user ? item.user.id : null),
                barang: barang.namaBarang || barang.nama || "N/A",
                kategori: kategori.nama || "Lainnya",
                jumlah: item.jumlahPinjam || 1,
                tanggal: tanggalFormatted,
                tanggalKembali: tanggalKembaliFormatted, // Tambahkan tanggal kembali
                status: item.status || "menunggu",
                catatan: item.catatan || "-",
                bulanAngka,
                tahunAngka,
                rawData: item
              });
            } catch (err) {
              console.error("Error formatting item:", err, item);
            }
          }
        }

        console.log("All borrows:", formattedData);
        setPeminjaman(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching borrows:", err);
        setError("Gagal memuat data peminjaman: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    // Fungsi untuk mengambil data user
    const fetchUserDetails = async (userId) => {
      try {
        const user = await getUsers(userId);
        setUserCache(prev => ({
          ...prev,
          [userId]: user
        }));
        return user;
      } catch (err) {
        console.error(`Error fetching user ${userId}:`, err);
        return null;
      }
    };

    // Cache untuk menyimpan data user yang sudah diambil
    const userCache = {};
    
    fetchBorrows();
  }, []);

  // Dalam useEffect, fetch semua users sekali saja
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        // Ubah array users menjadi object dengan id sebagai key
        const usersById = {};
        users.forEach(user => {
          usersById[user.id] = user;
        });
        setUserCache(usersById);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    
    fetchUsers();
  }, []);

  // Handler untuk aksi setujui/tolak
  const handleAction = async (id, action) => {
    try {
      const status = action === 'approve' ? 'disetujui' : 'ditolak';
      console.log(`Mengubah status peminjaman ID ${id} menjadi ${status}`);
      
      await updateBorrow(id, { status });
      
      // Update state secara lokal
      setPeminjaman(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      
      alert(`Peminjaman berhasil ${status}`);
    } catch (err) {
      console.error(`Error ${action} borrow:`, err);
      alert(`Gagal ${action === 'approve' ? 'menyetujui' : 'menolak'} peminjaman`);
    }
  };

  // Fungsi untuk membuka overlay konfirmasi pengembalian
  const handleReturnClick = (item) => {
    setBorrowToReturn(item);
    setIsReturnConfirmOpen(true);
  };

  // Ganti fungsi handleReturn dengan confirmReturn
  const confirmReturn = async () => {
    const id = borrowToReturn.id;
    try {
      // Dapatkan tanggal saat ini
      const currentDate = new Date();
      
      // Kode untuk menentukan status tidak berubah
      let isLate = false;
      
      if (borrowToReturn && borrowToReturn.rawData) {
        // Jika ada tanggal jatuh tempo dalam data API, gunakan itu
        if (borrowToReturn.rawData.tanggalJatuhTempo) {
          const dueDate = new Date(borrowToReturn.rawData.tanggalJatuhTempo);
          isLate = currentDate > dueDate;
        } 
        // Jika tidak, hitung berdasarkan tanggal pinjam + 7 hari
        else if (borrowToReturn.rawData.tanggalPinjam || borrowToReturn.rawData.createdAt) {
          const borrowDate = new Date(borrowToReturn.rawData.tanggalPinjam || borrowToReturn.rawData.createdAt);
          const dueDate = new Date(borrowDate);
          dueDate.setDate(dueDate.getDate() + 7); // Periode pinjam 7 hari
          isLate = currentDate > dueDate;
        }
      }
      
      // PERBAIKAN: Gunakan format enum yang sesuai dengan backend
      let status = isLate ? 'Terlambat' : 'Dikembalikan';
      
      // Format tanggal untuk tampilan
      const tanggalKembaliFormatted = formatDate(currentDate);
      
      // Siapkan data yang akan dikirim
      const returnData = { 
        status: status,
        tanggalKembali: currentDate.toISOString()
      };
      
      console.log("Sending return data:", returnData);
      
      let apiSuccess = false;
      try {
        // Coba update ke API
        await updateBorrow(id, returnData);
        apiSuccess = true;
      } catch (apiError) {
        console.error("Error updating database:", apiError);
        // API error, lanjutkan dengan UI update saja
      }
      
      // Untuk tampilan UI tetap gunakan format lowercase
      const displayStatus = isLate ? 'terlambat dikembalikan' : 'dikembalikan';
      
      // Update UI terlepas dari API berhasil atau tidak
      setPeminjaman(prev => 
        prev.map(item => 
          item.id === id ? { 
            ...item, 
            status: displayStatus, // Gunakan format yang konsisten untuk UI
            tanggalKembali: tanggalKembaliFormatted
          } : item
        )
      );
      
      // Notifikasi hanya jika API gagal
      if (!apiSuccess) {
        alert(`Barang ditandai sebagai ${displayStatus} di aplikasi, tetapi tidak tersimpan ke database. Silakan coba lagi nanti.`);
      }
      
      // Tutup overlay
      setIsReturnConfirmOpen(false);
    } catch (err) {
      console.error("Error in return process:", err);
      setIsReturnConfirmOpen(false);
    }
  };

  // Fungsi helper untuk format tanggal
  const formatDate = (date) => {
    const hari = date.getDate();
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ][date.getMonth()];
    const tahun = date.getFullYear();
    return `${hari} ${bulan} ${tahun}`;
  };

  // Filter data berdasarkan bulan dan tahun
  const filteredData = peminjaman.filter((item) => {
    // Jika tidak ada filter yang dipilih, tampilkan semua data
    if (!selectedBulan && !selectedTahun) return true;
    
    // Filter berdasarkan bulan saja
    if (selectedBulan && !selectedTahun) {
      return item.bulanAngka === selectedBulan;
    }
    
    // Filter berdasarkan tahun saja
    if (!selectedBulan && selectedTahun) {
      return item.tahunAngka === selectedTahun;
    }
    
    // Filter berdasarkan bulan dan tahun
    return item.bulanAngka === selectedBulan && item.tahunAngka === selectedTahun;
  });

  console.log("Data setelah filter:", filteredData);

  // Reset halaman ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBulan, selectedTahun]);

  // Pagination calculation
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Extract unique years for filter dropdown
  const uniqueYears = [...new Set(peminjaman.map(item => item.tahunAngka))].sort();

  console.log("Status rendering:", { loading, error, peminjaman: peminjaman.length, filteredData: filteredData.length });

  return (
    <div className="peminjaman-admin-wrapper">
      <div className="peminjaman-admin-container-full">
        <div className="peminjaman-admin-header">
          <h2 className="peminjaman-admin-title peminjaman-admin-title-blue">
            Peminjaman
          </h2>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </div>

        <div className="peminjaman-admin-card">
          <div className="peminjaman-admin-card-header">
            <span className="peminjaman-admin-card-title">
              Daftar Peminjaman
            </span>
            {/* Filter Bulan & Tahun */}
            <div className="peminjaman-admin-filter">
              <span className="peminjaman-admin-filter-label">Filter:</span>
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="peminjaman-admin-filter-select"
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
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className="peminjaman-admin-filter-select"
              >
                <option value="">Semua Tahun</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="peminjaman-admin-table-wrapper">
            {loading ? (
              <div className="peminjaman-admin-loading">
                <p>Memuat data peminjaman...</p>
              </div>
            ) : error ? (
              <div className="peminjaman-admin-error">
                <p>{error}</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="peminjaman-admin-no-data">
                <div className="peminjaman-admin-no-data-icon">
                  ⚠️
                </div>
                <h3 className="peminjaman-admin-no-data-title">
                  Data Tidak Ditemukan
                </h3>
                <p className="peminjaman-admin-no-data-message">
                  Tidak ada data peminjaman untuk ditampilkan atau periode yang dipilih.
                </p>
              </div>
            ) : (
              <>
                <table className="peminjaman-admin-table peminjaman-admin-table-blue">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Peminjam</th>
                      <th>Nama Barang</th>
                      <th>Kategori</th>
                      <th>Jumlah Barang</th>
                      <th>Tanggal Pengajuan</th>
                      <th>Tanggal Kembali</th>
                      <th>Catatan</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="text-center">
                          {indexOfFirst + idx + 1}
                        </td>
                        <td>{item.peminjam}</td>
                        <td>{item.barang}</td>
                        <td>{item.kategori}</td>
                        <td className="text-center">{item.jumlah}</td>
                        <td className="text-center">{item.tanggal}</td>
                        <td className="text-center">{item.tanggalKembali}</td>
                        <td>{item.catatan}</td>
                        <td className="text-center">
                          <span className={`status-badge status-${item.status}`}>
                            {item.status || "menunggu"}
                          </span>
                        </td>
                        <td className="text-center">
                          {item.status === "dikembalikan" || item.status === "Dikembalikan" || item.status === "terlambat dikembalikan" ? (
                            <span className="text-muted">Selesai</span>
                          ) : (
                            <div className="peminjaman-admin-actions">
                              {/* Tombol Kembalikan selalu tersedia untuk item yang belum dikembalikan */}
                              <button
                                className="peminjaman-admin-btn-aksi peminjaman-admin-btn-return"
                                title="Kembalikan"
                                onClick={() => handleReturnClick(item)}
                              >
                                ↩️ Kembalikan
                              </button>
                              
                              {/* Tombol setuju/tolak hanya untuk status "menunggu" */}
                              {item.status === "menunggu" && (
                                <div className="peminjaman-admin-action-group" style={{ marginTop: "8px" }}>
                                  <button
                                    className="peminjaman-admin-btn-aksi peminjaman-admin-btn-tolak"
                                    title="Tolak"
                                    onClick={() => handleAction(item.id, 'reject')}
                                  >
                                    ❌ Tolak
                                  </button>
                                  <button
                                    className="peminjaman-admin-btn-aksi peminjaman-admin-btn-setujui"
                                    title="Setujui"
                                    style={{ marginLeft: "8px" }}
                                    onClick={() => handleAction(item.id, 'approve')}
                                  >
                                    ✅ Setujui
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="peminjaman-admin-pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="peminjaman-admin-pagination-btn"
                    >
                      {"<"}
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`peminjaman-admin-pagination-btn${
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
                      className="peminjaman-admin-pagination-btn"
                    >
                      {">"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Komponen konfirmasi pengembalian */}
      <ReturnConfirm
        isOpen={isReturnConfirmOpen}
        item={borrowToReturn}
        onClose={() => setIsReturnConfirmOpen(false)}
        onConfirm={confirmReturn}
      />
    </div>
  );
};

export default Peminjaman;
