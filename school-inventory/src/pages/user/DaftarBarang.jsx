import React, { useState, useEffect } from "react";
import { getItems } from "../../services/apiService";

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

  if (loading) {
    return (
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-6">Daftar Barang</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Memuat data barang...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-6">Daftar Barang</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">Daftar Barang</h1>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Daftar Barang Tersedia</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tersedia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {barang.filter(item => item.tersedia > 0).map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.namaBarang}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.kategori}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.tersedia}</div>
                  </td>
                </tr>
              ))}
              
              {barang.filter(item => item.tersedia > 0).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada barang tersedia saat ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarBarang;