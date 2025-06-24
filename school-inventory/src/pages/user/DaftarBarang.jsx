import React, { useState, useEffect } from "react";
import { getItems } from "../../services/apiService";
import "./DaftarBarang.css"; // Assuming you have some styles for this component

const DaftarBarang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        setLoading(true);
        const data = await getItems();
        setBarang(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Gagal memuat data barang");
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();
  }, []);

  return (
    <div className="daftar-barang-container">
      <div className="daftar-barang-card">
        <h1 className="daftar-barang-title">Daftar Barang</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Barang Tersedia</h2>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Memuat data barang...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="daftar-barang-table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Barang</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tersedia</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {barang.filter(item => item.tersedia > 0).map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{item.namaBarang}</td>
                      <td className="px-4 py-3">{item.kategori}</td>
                      <td className="px-4 py-3">{item.tersedia}</td>
                    </tr>
                  ))}
                  {barang.filter(item => item.tersedia > 0).length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                        Tidak ada barang tersedia saat ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarBarang;