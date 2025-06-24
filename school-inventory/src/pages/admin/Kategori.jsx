import React, { useState, useEffect } from "react";
import "../../index.css";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../../services/apiService";
import EditKategori from '../../components/overlay/EditKategori';
import TambahKategori from '../../components/overlay/TambahKategori'; // Import komponen TambahKategori
import DeleteConfirm from '../../components/overlay/DeleteConfirm'; // Tambahkan di bagian import

const Kategori = () => {
  // State tambahan untuk TambahKategori modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  
  // State yang sudah ada
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Tambahkan state untuk pop-up konfirmasi hapus
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        console.log("Categories data:", data);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Gagal memuat data kategori");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        await deleteCategory(id);
        // Refresh categories after delete
        setCategories(categories.filter(cat => cat.id !== id));
        alert("Kategori berhasil dihapus");
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Gagal menghapus kategori");
      }
    }
  };

  // Fungsi untuk membuka modal edit
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  // Fungsi untuk menyimpan perubahan
  const handleSaveEdit = async (updatedData) => {
    try {
      console.log("Saving edit with data:", updatedData);
      const result = await updateCategory(selectedCategory.id, updatedData);
      console.log("API response:", result);
      
      if (result) {
        // Update state lokal dengan data yang benar
        setCategories(categories.map(cat => 
          cat.id === selectedCategory.id ? {...cat, ...updatedData} : cat
        ));
        setIsEditOpen(false);
        // Hapus alert sukses
      }
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Gagal memperbarui kategori: " + err.message); // Tetap tampilkan alert error
    }
  };

  // Handler untuk tombol Tambah Kategori
  const handleTambahClick = () => {
    setIsTambahOpen(true);
  };

  // Handler untuk menyimpan kategori baru
  const handleSaveTambah = async (newCategory) => {
    try {
      const savedCategory = await createCategory({
        nama: newCategory.kategori,
        deskripsi: newCategory.deskripsi || ""
      });
      
      // Update state lokal dengan kategori baru
      setCategories([...categories, savedCategory]);
      
      // Tutup modal
      setIsTambahOpen(false);
      // Hapus alert sukses
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Gagal menambahkan kategori"); // Tetap tampilkan alert error
    }
  };

  // Pagination calculation
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Ubah handler delete menjadi show popup
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmOpen(true);
  };

  // Proses penghapusan setelah konfirmasi
  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      // Refresh categories after delete
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <div className="kategori-admin-wrapper">
      <div className="kategori-admin-container-full">
        <div className="kategori-admin-header">
          <h2 className="kategori-admin-title kategori-admin-title-blue">
            Kategori
          </h2>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </div>
        <div className="kategori-admin-card">
          <div className="kategori-admin-card-header">
            <span className="kategori-admin-card-title">Daftar Kategori</span>
            <button 
              className="kategori-admin-btn-tambah"
              onClick={handleTambahClick} // Tambahkan onClick handler
            >
              Tambah Kategori
            </button>
          </div>
          <div className="kategori-admin-table-wrapper">
            {loading ? (
              <div className="kategori-admin-loading">
                <p>Memuat data kategori...</p>
              </div>
            ) : error ? (
              <div className="kategori-admin-error">
                <p>{error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="kategori-admin-no-data">
                <div className="kategori-admin-no-data-icon">
                  ⚠️
                </div>
                <h3 className="kategori-admin-no-data-title">
                  Data Tidak Ditemukan
                </h3>
                <p className="kategori-admin-no-data-message">
                  Tidak ada data kategori untuk ditampilkan.
                </p>
              </div>
            ) : (
              <>
                <table className="kategori-admin-table kategori-admin-table-blue">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kategori</th>
                      <th>Deskripsi</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="text-center">{indexOfFirst + idx + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.deskripsi || "-"}</td>
                        <td className="text-center">
                          <button 
                            className="kategori-admin-btn-aksi" 
                            title="Edit"
                            onClick={() => handleEditClick(item)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            className="kategori-admin-btn-aksi"
                            title="Hapus"
                            style={{
                              marginLeft: "8px",
                              color: "#d32f2f",
                              borderColor: "#d32f2f",
                            }}
                            onClick={() => handleDeleteClick(item)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="kategori-admin-pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="kategori-admin-pagination-btn"
                    >
                      {"<"}
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`kategori-admin-pagination-btn${
                          currentPage === i + 1 ? " active" : ""
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="kategori-admin-pagination-btn"
                    >
                      {">"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Komponen EditKategori yang sudah ada */}
      <EditKategori
        isOpen={isEditOpen}
        kategori={selectedCategory}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />
      
      {/* Tambahkan komponen TambahKategori */}
      <TambahKategori
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        onSave={handleSaveTambah}
      />

      {/* Pop-up konfirmasi hapus */}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        item={categoryToDelete}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Kategori;
