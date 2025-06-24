import React, { useState, useEffect } from "react";
import { getCategories } from "../../services/apiService";
import "./AksiBarang.css";

const AksiBarang = ({ isOpen, type, barang, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    kategori_id: "",
    jumlah: 0,
    kondisi: "", 
    deskripsi: "" 
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories saat component di-mount
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
    
    // Initialize form data when barang prop changes
    if (barang && type === 'edit') {
      setFormData({
        nama: barang.nama || "",
        kategori: barang.kategori || "",
        kategori_id: barang.kategori_id || "",
        jumlah: barang.jumlah || 0,
        kondisi: barang.kondisi || "Baik",
        deskripsi: barang.deskripsi || "-"
      });
    }
  }, [barang, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="aksi-barang-overlay">
      <div className="aksi-barang-modal">
        <div className="aksi-barang-content">
          <h1>{type === 'edit' ? 'Edit Barang' : 'Hapus Barang'}</h1>

          {type === 'edit' ? (
            <form className="aksi-barang-form" onSubmit={handleSubmit}>
              <div className="aksi-barang-form-row">
                <div className="aksi-barang-form-group">
                  <label htmlFor="nama">Nama Barang</label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="aksi-barang-form-group">
                  <label htmlFor="kategori_id">Kategori</label>
                  <select
                    id="kategori_id"
                    name="kategori_id"
                    value={formData.kategori_id}
                    onChange={handleChange}
                    className="aksi-barang-select"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="aksi-barang-form-row">
                <div className="aksi-barang-form-group">
                  <label htmlFor="jumlah">Jumlah</label>
                  <input
                    type="number"
                    id="jumlah"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                
                <div className="aksi-barang-form-group">
                  <label htmlFor="kondisi">Kondisi</label>
                  <select
                    id="kondisi"
                    name="kondisi"
                    value={formData.kondisi}
                    onChange={handleChange}
                    className="aksi-barang-select"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>
              
              <div className="aksi-barang-form-group full-width">
                <label htmlFor="deskripsi">Deskripsi</label>
                <input
                  type="text"
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                />
              </div>
              
              <div className="aksi-barang-actions">
                <button type="button" onClick={onClose} className="aksi-barang-kembali">
                  Batal
                </button>
                <button type="submit" className="aksi-barang-simpan">
                  Simpan
                </button>
              </div>
            </form>
          ) : (
            <div className="aksi-barang-delete-confirm">
              <p>
                Apakah Anda yakin ingin menghapus barang <strong>{barang?.nama}</strong>?
              </p>
              <p className="aksi-barang-delete-warning">
                Tindakan ini tidak dapat dibatalkan!
              </p>
              <div className="aksi-barang-actions">
                <button type="button" onClick={onClose} className="aksi-barang-kembali">
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => onConfirm()}
                  className="aksi-barang-hapus"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AksiBarang;