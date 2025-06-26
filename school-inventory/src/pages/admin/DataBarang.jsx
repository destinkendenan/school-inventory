import React, { useState, useEffect } from "react";
import "../../index.css";
import "./DataBarang.css";
import { getItems, createItem, updateItem, deleteItem } from "../../services/apiService";
import TambahBarang from "../../components/overlay/TambahBarang";
import AksiBarang from "../../components/overlay/AksiBarang";

const DataBarang = () => {
  const [dataBarang, setDataBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isAksiOpen, setIsAksiOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [aksiType, setAksiType] = useState('');

  // Fetch data barang
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getItems();
        
        // Format data untuk sesuai dengan struktur UI
        const formattedData = data.map(item => ({
          id: item.id,
          nama: item.namaBarang,
          kategori: item.kategori,
          jumlah: item.jumlah,
          tersedia: item.tersedia,
          dipinjam: item.dipinjam,
          kondisi: item.kondisi || "Baik", // Tambahkan properti kondisi
          deskripsi: item.deskripsi || "-" // Tambahkan properti deskripsi
        }));
        
        setDataBarang(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Gagal memuat data barang");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentData = dataBarang;

  // Handler untuk tambah barang
  const handleTambahBarang = async (data) => {
    try {
      const newItem = {
        kodeBarang: Math.random().toString(36).substring(2, 10).toUpperCase(),
        namaBarang: data.nama,
        kategori_id: parseInt(data.kategori_id || 1),
        jumlah: parseInt(data.jumlah),
        deskripsi: data.deskripsi || "",
        kondisi: data.kondisi || "Baik" // Tambahkan kondisi dari form
      };
      
      const createdItem = await createItem(newItem);
      
      // Update state dengan item baru
      setDataBarang(prev => [...prev, {
        id: createdItem.id,
        nama: createdItem.namaBarang,
        kategori: data.kategori,
        jumlah: createdItem.jumlah,
        tersedia: createdItem.tersedia,
        dipinjam: createdItem.dipinjam,
        kondisi: createdItem.kondisi || data.kondisi || "Baik", // Tambahkan kondisi
        deskripsi: createdItem.deskripsi || data.deskripsi || "-" // Tambahkan deskripsi
      }]);
      
      setIsTambahOpen(false);
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Gagal menambahkan barang");
    }
  };

  // Handler untuk edit/hapus barang
  const handleAksiBarang = async (data) => {
    try {
      if (aksiType === 'edit') {
        const updatedItem = {
          namaBarang: data.nama,
          kategori_id: parseInt(data.kategori_id || 1),
          jumlah: parseInt(data.jumlah),
          deskripsi: data.deskripsi || "",
          kondisi: data.kondisi || "Baik" // Tambahkan kondisi dari form
        };
        
        await updateItem(selectedBarang.id, updatedItem);
        
        // Update state dengan item yang diupdate
        setDataBarang(prev => prev.map(item => 
          item.id === selectedBarang.id 
            ? {
                ...item, 
                nama: data.nama, 
                kategori: data.kategori, 
                jumlah: data.jumlah,
                kondisi: data.kondisi || "Baik", // Tambahkan kondisi
                deskripsi: data.deskripsi || "-" // Tambahkan deskripsi
              } 
            : item
        ));
      } else if (aksiType === 'delete') {
        await deleteItem(selectedBarang.id);
        
        // Remove item from state
        setDataBarang(prev => prev.filter(item => item.id !== selectedBarang.id));
      }
      
      setIsAksiOpen(false);
    } catch (err) {
      console.error(`Error ${aksiType === 'edit' ? 'updating' : 'deleting'} item:`, err);
      alert(`Gagal ${aksiType === 'edit' ? 'mengubah' : 'menghapus'} barang`);
    }
  };

  if (loading) return (
    <div className="data-barang-admin-wrapper">
      <div className="data-barang-admin-container-full">
        <div className="data-barang-admin-header">
          <h2 className="data-barang-admin-title data-barang-admin-title-blue">
            Data Barang
          </h2>
        </div>
        <div className="data-barang-admin-card">
          <div className="data-barang-admin-card-header">
            <span className="data-barang-admin-card-title">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="data-barang-admin-wrapper">
      <div className="data-barang-admin-container-full">
        <div className="data-barang-admin-header">
          <h2 className="data-barang-admin-title data-barang-admin-title-blue">
            Data Barang
          </h2>
        </div>
        <div className="data-barang-admin-card">
          <div className="data-barang-admin-card-header">
            <span className="data-barang-admin-card-title">Error: {error}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="data-barang-admin-wrapper">
      <div className="data-barang-admin-container-full">
        <div className="data-barang-admin-header">
          <h2 className="data-barang-admin-title data-barang-admin-title-blue">
            Data Barang
          </h2>
        </div>
        <div className="data-barang-admin-card">
          <div className="data-barang-admin-card-header">
            <span className="data-barang-admin-card-title">Daftar Barang</span>
            <button 
              className="data-barang-admin-btn-tambah"
              onClick={() => setIsTambahOpen(true)}
            >
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
                  <th>Kondisi</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((barang, idx) => (
                  <tr key={barang.id || idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{barang.nama}</td>
                    <td>{barang.kategori}</td>
                    <td className="text-center">{barang.jumlah}</td>
                    <td className="text-center">{barang.tersedia}</td>
                    <td className="text-center">{barang.dipinjam}</td>
                    <td>{barang.kondisi}</td>
                    <td className="text-truncate" style={{maxWidth: "150px"}} title={barang.deskripsi}>
                      {barang.deskripsi}
                    </td>
                    <td className="text-center">
                      <button
                        className="data-barang-admin-btn-aksi"
                        title="Edit"
                        onClick={() => {
                          console.log("Edit clicked:", barang.id);
                          setSelectedBarang(barang);
                          setAksiType('edit');
                          setIsAksiOpen(true);
                        }}
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
                        onClick={() => {
                          setSelectedBarang(barang);
                          setAksiType('delete');
                          setIsAksiOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isTambahOpen && (
        <TambahBarang
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          onSave={handleTambahBarang}
        />
      )}
      
      {isAksiOpen && (
        <AksiBarang
          isOpen={isAksiOpen}
          type={aksiType}
          barang={selectedBarang}
          onClose={() => setIsAksiOpen(false)}
          onConfirm={handleAksiBarang}
        />
      )}
    </div>
  );
};

export default DataBarang;
