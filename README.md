# School Inventory

Aplikasi **Sistem Informasi Inventaris Sekolah** berbasis web, terdiri dari:
- **Frontend:** ReactJS (Vite)
- **Backend:** FastAPI (Python)
- **Database:** MySQL

---

## Fitur Utama

- **Autentikasi:** Login, Register, Role Admin & User
- **Manajemen Barang:** Tambah, edit, hapus, dan lihat data inventaris
- **Peminjaman Barang:** Pengajuan, persetujuan, pengembalian barang
- **Laporan & Riwayat:** Laporan peminjaman, riwayat aktivitas
- **Manajemen Kategori & Pengguna:** (khusus admin)
- **Dashboard:** Statistik dan ringkasan aktivitas

---

## Struktur Folder

```
school-inventory/
│
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── config/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── utils/
│   │   └── main.py
│   ├── requirements.txt
│   └── ...
│
├── src/               # React frontend
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
└── README.md
```

---

## Cara Menjalankan

### 1. **Backend (FastAPI)**

```bash
cd backend
python -m venv env
source env/bin/activate  # atau .\env\Scripts\activate di Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- Konfigurasi database di `.env`
- Endpoint utama: `http://127.0.0.1:8000`
- Dokumentasi API: `http://127.0.0.1:8000/docs`

### 2. **Frontend (React + Vite)**

```bash
cd src
npm install
npm run dev
```

- Akses di: `http://localhost:5173`
- Pastikan endpoint API di frontend (apiService.js) mengarah ke backend (`http://127.0.0.1:8000/api/...`)
- Untuk development, gunakan proxy di vite.config.js jika perlu.

---

## Konfigurasi Proxy (Opsional)

Jika frontend dan backend berjalan di port berbeda, tambahkan di vite.config.js:

```js
export default {
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    }
  }
}
```

---

## Akun Default

- **Admin:**  
  Username: `admin`  
  Password: `admin123`  
  (atau sesuai data seed di backend)

- **User:**  
  Register melalui halaman register.

---

## Pengembangan & Kontribusi

1. Fork & clone repo ini.
2. Buat branch baru untuk fitur/bugfix.
3. Commit perubahan dengan pesan yang jelas.
4. Pull request ke branch utama.


---

**Catatan:**  
- Pastikan backend berjalan sebelum frontend.
- Jika ada error CORS atau 404 pada API, cek endpoint dan proxy config.
- Untuk pertanyaan lebih lanjut, silakan buka issue di repo ini.

---

Silakan sesuaikan bagian **database**, **akun default**, dan **kontak** sesuai kebutuhan proyek Anda.
