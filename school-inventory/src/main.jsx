import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'


// INI YANG KU KOMEN, KU PAKE COBA TAMPILANNYA BETUL MI 
// ATAU TIDAK BY TIDAK BY TIA CANTIKK


// import { StrictMode, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import SidebarAdmin from './components/SidebarAdmin'
// import './index.css'
// import SidebarUser from './components/SidebarUser'
// import TambahBarang from './components/overlay/TambahBarang'

// const App = () => {
//   // State untuk mengontrol modal
//   const [isModalOpen, setIsModalOpen] = useState(true); // Set true agar langsung terbuka

//   const handleClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleSave = (data) => {
//     console.log('Data barang tersimpan:', data);
//     setIsModalOpen(false);
//   };

//   return (
//     <BrowserRouter>
//       {/* <SidebarUser />
//       <SidebarAdmin /> */}

      
      
//       <TambahBarang 
//         isOpen={isModalOpen}
//         onClose={handleClose}
//         onSave={handleSave}
//       />
//     </BrowserRouter>
//   );
// };

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// import { StrictMode, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import SidebarAdmin from './components/SidebarAdmin'
// import './index.css'
// import SidebarUser from './components/SidebarUser'
// import TambahBarang from './components/overlay/TambahBarang'
// import AksiBarang from './components/overlay/AksiBarang'

// const App = () => {
//   // State untuk mengontrol modal TambahBarang
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // State untuk mengontrol modal AksiBarang
//   const [isAksiModalOpen, setIsAksiModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('edit'); // 'edit' atau 'delete'
  
//   // Contoh data barang untuk diedit/dihapus
//   const contohBarang = {
//     id: 1,
//     nama: 'Kursi Kayu',
//     jumlah: 10,
//     kategori: 'Furniture'
//   };

//   // Handler untuk TambahBarang
//   const handleClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleSave = (data) => {
//     console.log('Data barang tersimpan:', data);
//     setIsModalOpen(false);
//   };
  
//   // Handler untuk AksiBarang
//   const handleAksiClose = () => {
//     setIsAksiModalOpen(false);
//   };
  
//   const handleConfirm = (result) => {
//     if (modalType === 'edit') {
//       console.log('Data barang yang diedit:', result);
//     } else {
//       console.log('ID barang yang dihapus:', result);
//     }
//     setIsAksiModalOpen(false);
//   };
  
//   // Toggle untuk menampilkan modal yang berbeda
//   const toggleTambahModal = () => {
//     setIsModalOpen(true);
//     setIsAksiModalOpen(false);
//   };
  
//   const toggleEditModal = () => {
//     setModalType('edit');
//     setIsAksiModalOpen(true);
//     setIsModalOpen(false);
//   };
  
//   const toggleDeleteModal = () => {
//     setModalType('delete');
//     setIsAksiModalOpen(true);
//     setIsModalOpen(false);
//   };

//   return (
//     <BrowserRouter>
//       {/* <SidebarUser />
//       <SidebarAdmin /> */}
      
//       <div style={{ padding: '20px' }}>
        
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//           <button onClick={toggleEditModal}>Edit Barang</button>
//           <button onClick={toggleDeleteModal}>Hapus Barang</button>
//         </div>
//       </div>
      
//       {/* Modal Tambah Barang */}
//       <TambahBarang 
//         isOpen={isModalOpen}
//         onClose={handleClose}
//         onSave={handleSave}
//       />
      
//       {/* Modal Aksi Barang (Edit/Delete) */}
//       <AksiBarang
//         isOpen={isAksiModalOpen}
//         type={modalType}
//         barang={contohBarang}
//         onClose={handleAksiClose}
//         onConfirm={handleConfirm}
//       />
//     </BrowserRouter>
//   );
// };

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );


// // Di main.jsx atau komponen parent lainnya
// // import { useState } from 'react';
// // import TambahKategori from './components/overlay/TambahKategori';

// // function KategoriPage() {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
  
// //   const handleOpenModal = () => {
// //     setIsModalOpen(true);
// //   };
  
// //   const handleCloseModal = () => {
// //     setIsModalOpen(false);
// //   };
  
// //   const handleSaveKategori = (data) => {
// //     console.log('Data kategori baru:', data);
// //     // Implementasi menyimpan data ke backend/state
// //     setIsModalOpen(false);
// //   };
  
// //   return (
// //     <div>
// //       <button onClick={handleOpenModal}>Tambah Kategori</button>
      
// //       <TambahKategori 
// //         isOpen={isModalOpen}
// //         onClose={handleCloseModal}
// //         onSave={handleSaveKategori}
// //       />
// //     </div>
// //   );
// // }

// import { StrictMode, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import TambahKategori from './components/overlay/TambahKategori'
// import './index.css'

// const KategoriPage = () => {
//   // Ubah ini ke true agar modal langsung muncul saat aplikasi dibuka
//   const [isModalOpen, setIsModalOpen] = useState(true);
  
//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };
  
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };
  
//   const handleSaveKategori = (data) => {
//     console.log('Data kategori baru:', data);
//     setIsModalOpen(false);
//   };
  
//   return (
//     <div>
      
      
//       <TambahKategori 
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSave={handleSaveKategori}
//       />
//     </div>
//   );
// }

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <KategoriPage />
//   </StrictMode>
// );