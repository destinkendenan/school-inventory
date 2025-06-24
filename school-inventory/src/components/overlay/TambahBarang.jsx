import React, { useState, useEffect } from 'react';
import './TambahBarang.css';
import { getCategories } from '../../services/apiService';

const TambahBarang = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nama: '',
        jumlah: 0,
        kategori_id: '',
        kategori: '',  // Untuk UI display
        kondisi: 'Baik', // Default kondisi
        deskripsi: ''    // Default deskripsi
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch kategori dari API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'kategori_id' && value) {
            // Saat kategori dipilih, simpan juga nama kategorinya
            const selectedCategory = categories.find(cat => cat.id === parseInt(value));
            setFormData({
                ...formData,
                kategori_id: value,
                kategori: selectedCategory ? selectedCategory.nama : ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
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
                            <label htmlFor="kategori_id">Kategori</label>
                            <select
                                id="kategori_id"
                                name="kategori_id"
                                value={formData.kategori_id}
                                onChange={handleChange}
                                className="tambah-barang-select"
                                disabled={loading}
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="tambah-barang-form-group">
                            <label htmlFor="kondisi">Kondisi</label>
                            <select
                                id="kondisi"
                                name="kondisi"
                                value={formData.kondisi}
                                onChange={handleChange}
                            >
                                <option value="Baik">Baik</option>
                                <option value="Rusak Ringan">Rusak Ringan</option>
                                <option value="Rusak Berat">Rusak Berat</option>
                            </select>
                        </div>

                        <div className="tambah-barang-form-group">
                            <label htmlFor="deskripsi">Deskripsi</label>
                            <textarea
                                id="deskripsi"
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                    
                    <div className="tambah-barang-actions">
                        <button className="tambah-barang-kembali" onClick={onClose}>
                            Kembali
                        </button>
                        <button 
                            className="tambah-barang-simpan" 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TambahBarang;