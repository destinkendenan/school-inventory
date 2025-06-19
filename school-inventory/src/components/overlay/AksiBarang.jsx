    import React, { useState, useEffect } from 'react';
    import './AksiBarang.css';

    const AksiBarang = ({ isOpen, type, barang, onClose, onConfirm }) => {
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

    // Mengisi form data ketika barang berubah
    useEffect(() => {
        if (barang) {
        setFormData({
            nama: barang.nama || '',
            jumlah: barang.jumlah || 0,
            kategori: barang.kategori || ''
        });
        }
    }, [barang]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value // Simpan string apapun yang diketik user
    });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    const handleDelete = () => {
        onConfirm(barang.id);
    };

    if (!isOpen) return null;

    return (
        <div className="aksi-barang-overlay">
        <div className="aksi-barang-modal">
            <div className="aksi-barang-content">
            <h1>{type === 'edit' ? 'Edit Barang' : 'Hapus Barang'}</h1>
            
            {type === 'edit' ? (
                <div className="aksi-barang-form">
                <div className="aksi-barang-form-row">
                    <div className="aksi-barang-form-group">
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
                    
                    <div className="aksi-barang-form-group">
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
                
                <div className="aksi-barang-form-group full-width">
                    <label htmlFor="kategori">Kategori</label>
                    <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="aksi-barang-select"
                    >
                    {kategoriOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
                </div>
                </div>
            ) : (
                <div className="aksi-barang-delete-confirm">
                <p>Apakah Anda yakin ingin menghapus barang "{barang?.nama}"?</p>
                <p className="aksi-barang-delete-warning">
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                </div>
            )}
            
            <div className="aksi-barang-actions">
                <button className="aksi-barang-kembali" onClick={onClose}>
                Kembali
                </button>
                
                {type === 'edit' ? (
                <button 
                    className="aksi-barang-simpan" 
                    onClick={handleSubmit}
                >
                    Simpan
                </button>
                ) : (
                <button 
                    className="aksi-barang-hapus" 
                    onClick={handleDelete}
                >
                    Hapus
                </button>
                )}
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default AksiBarang;