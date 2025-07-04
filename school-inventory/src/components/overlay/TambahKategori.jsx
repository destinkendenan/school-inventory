import React, { useState } from 'react';
import './TambahKategori.css';

const TambahKategori = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        kategori: '',
        deskripsi: '' // Hanya simpan kategori dan deskripsi
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="tambah-kategori-overlay">
        <div className="tambah-kategori-modal">
            <div className="tambah-kategori-content">
            <h1>Tambah Kategori</h1>
            
            <div className="tambah-kategori-form">
                <div className="tambah-kategori-form-row">
                <div className="tambah-kategori-form-group">
                    <label htmlFor="kategori">Kategori</label>
                    <input
                    type="text"
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    placeholder="Kategori"
                    required
                    />
                </div>
                
                {/* Hapus field jumlah barang */}
                
                <div className="tambah-kategori-form-group">
                    <label htmlFor="deskripsi">Deskripsi</label>
                    <input
                    type="text"
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Deskripsi"
                    />
                </div>
                </div>
            </div>
            
            <div className="tambah-kategori-actions">
                <button className="tambah-kategori-kembali" onClick={onClose}>
                Kembali
                </button>
                <button className="tambah-kategori-tambah" onClick={handleSubmit}>
                Tambah
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default TambahKategori;