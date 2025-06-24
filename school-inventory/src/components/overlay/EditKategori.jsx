import React, { useState, useEffect } from 'react';
import './EditKategori.css';

const EditKategori = ({ isOpen, kategori, onClose, onSave }) => {
  // Inisialisasi dengan nilai default
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: ''
  });

  // Tambahkan logging untuk debug
  console.log("EditKategori received:", kategori);

  // Perbaikan useEffect untuk memastikan formData terisi dengan benar
  useEffect(() => {
    if (kategori) {
      console.log("Setting form data with:", kategori);
      setFormData({
        nama: kategori.nama || '',
        deskripsi: kategori.deskripsi || ''
      });
    }
  }, [kategori]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Di EditKategori.jsx, ubah fungsi handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Konversi ke format yang diharapkan API
      const dataForApi = {
        id: kategori.id,
        nama: formData.nama,
        deskripsi: formData.deskripsi
      };
      
      // Kirim data ke parent component melalui onSave
      await onSave(dataForApi);
      
      // Setelah berhasil, tutup overlay
      onClose();
    } catch (error) {
      // Jika terjadi error, tampilkan pesan tapi jangan tutup overlay
      console.error("Error saving category:", error);
      alert("Gagal menyimpan kategori: " + (error.message || "Unknown error"));
    }
  };

  // Jika overlay tidak terbuka atau kategori kosong, jangan render apapun
  if (!isOpen || !kategori) return null;

  return (
    <div className="kategori-edit-overlay">
      <div className="kategori-edit-modal">
        <div className="kategori-edit-content">
          <h1>Edit Kategori</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nama">Nama Kategori</label>
              <input 
                type="text" 
                id="nama" 
                name="nama" 
                value={formData.nama}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="deskripsi">Deskripsi</label>
              <input 
                type="text" 
                id="deskripsi" 
                name="deskripsi" 
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Batal
              </button>
              <button type="submit" className="btn-save">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditKategori;