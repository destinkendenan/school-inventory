import { getItems, createBorrow } from "../../services/apiService";
import { useState, useEffect } from "react";

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

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Kartu Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Peminjaman Saya */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="mt-4 text-sm text-gray-500">Total Peminjaman Saya</h2>
          <p className="text-3xl font-bold mt-1">5</p>
        </div>
        
        {/* Barang Sedang Dipinjam */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="mt-4 text-sm text-gray-500">Barang Sedang Dipinjam</h2>
          <p className="text-3xl font-bold mt-1">2</p>
        </div>
        
        {/* Barang Dikembalikan */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="mt-4 text-sm text-gray-500">Barang Dikembalikan</h2>
          <p className="text-3xl font-bold mt-1">3</p>
        </div>
      </div>
      
      {/* Tabel Riwayat Peminjaman */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Riwayat Peminjaman</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pinjam
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pengembalian
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Papan Tulis</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">12 Juni 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Dipinjam
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  -
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Proyektor</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">10 Juni 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Dikembalikan
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  11 Juni 2025
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Laptop ASUS</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">9 Juni 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Dipinjam
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  -
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Meja</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">8 Juni 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Dikembalikan
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  12 Juni 2025
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Bola Basket</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">7 Juni 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Dikembalikan
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  8 Juni 2025
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Form Permintaan Peminjaman */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Permintaan Peminjaman</h2>
        
        {formSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {formSuccess}
          </div>
        )}
        
        {formError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {formError}
          </div>
        )}
        
        <form onSubmit={handlePeminjamanSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang
              </label>
              <select
                name="barang_id"
                value={formPeminjaman.barang_id}
                onChange={handleFormChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                disabled={loadingBarang || submitting}
              >
                <option value="">-- Pilih Barang --</option>
                {barangTersedia.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.namaBarang} - Tersedia: {item.tersedia}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Barang
              </label>
              <input
                type="number"
                name="jumlahPinjam"
                min="1"
                max={formPeminjaman.barang_id ? 
                  barangTersedia.find(i => i.id === parseInt(formPeminjaman.barang_id))?.tersedia || 1 
                  : 1}
                value={formPeminjaman.jumlahPinjam}
                onChange={handleFormChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                disabled={submitting}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pengembalian
            </label>
            <input
              type="date"
              name="tanggalKembali"
              value={formPeminjaman.tanggalKembali}
              onChange={handleFormChange}
              min={new Date().toISOString().split('T')[0]}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              disabled={submitting}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              name="catatan"
              value={formPeminjaman.catatan}
              onChange={handleFormChange}
              rows="3"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              disabled={submitting}
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={submitting || loadingBarang}
            >
              {submitting ? "Memproses..." : "Ajukan Peminjaman"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;