    import React, { useState } from 'react';
    import './TambahBarang.css';

    const TambahBarang = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nama: '',
        jumlah: 0,
        kategori: ''
    });

    // Daftar kategori yang tersedia
    const kategoriOptions = [
        { value: '', label: 'Pilih Kategori' },
        { value: 'Furniture', label: 'Furniture' },
        { value: 'ATK', label: 'ATK' },
        { value: 'Elektronik', label: 'Elektronik' }
    ];

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
        <div className="tambah-barang-overlay">
        <div className="tambah-barang-modal">
            <div className="tambah-barang-content">
            <h1>Tambah Barang Baru</h1>
            
            <div className="tambah-barang-form">
                <div className="tambah-barang-form-row">
                <div className="tambah-barang-form-group">
                    <label htmlFor="nama">Nama Barang</label>
                    <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Nama Barang"
                    />
                </div>
                
                <div className="tambah-barang-form-group">
                    <label htmlFor="jumlah">Jumlah Barang</label>
                    <input
                    type="number"
                    id="jumlah"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    min="0"
                    />
                </div>
                </div>
                
                <div className="tambah-barang-form-group full-width">
                <label htmlFor="kategori">Kategori</label>
                <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="tambah-barang-select"
                >
                    {kategoriOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>
            </div>
            
            <div className="tambah-barang-actions">
                <button className="tambah-barang-kembali" onClick={onClose}>
                Kembali
                </button>
                <button className="tambah-barang-simpan" onClick={handleSubmit}>
                Simpan
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default TambahBarang;