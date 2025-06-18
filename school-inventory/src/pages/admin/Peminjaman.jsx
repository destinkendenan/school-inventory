import React, { useState, useEffect } from "react";
import "../../index.css";

const dataPeminjaman = [
  // Data untuk bulan Juni
  {
    peminjam: "Rafly",
    barang: "kursi",
    kategori: "Alat",
    jumlah: 5,
    tanggal: "15 Juni 2025",
  },
  {
    peminjam: "Rafly",
    barang: "meja",
    kategori: "Alat",
    jumlah: 21,
    tanggal: "15 Juni 2025",
  },
  {
    peminjam: "Lifsa",
    barang: "kabel HDMI",
    kategori: "Alat",
    jumlah: 22,
    tanggal: "12 Juni 2025",
  },
  {
    peminjam: "Kezia",
    barang: "mikroskop",
    kategori: "Alat",
    jumlah: 11,
    tanggal: "11 Juni 2025",
  },
  {
    peminjam: "Destin",
    barang: "kabel HDMI",
    kategori: "Alat",
    jumlah: 23,
    tanggal: "10 Juni 2025",
  },
  {
    peminjam: "Tia",
    barang: "colokan mata 4",
    kategori: "Alat",
    jumlah: 100,
    tanggal: "09 Juni 2025",
  },
  {
    peminjam: "Sheryl",
    barang: "papan tulis",
    kategori: "Alat",
    jumlah: 32,
    tanggal: "05 Juni 2025",
  },
  {
    peminjam: "Agus",
    barang: "Proyektor",
    kategori: "Alat",
    jumlah: 98,
    tanggal: "04 Juni 2025",
  },
  // Data untuk bulan Agustus
  {
    peminjam: "Budi",
    barang: "Laptop",
    kategori: "Elektronik",
    jumlah: 3,
    tanggal: "15 Agustus 2025",
  },
  {
    peminjam: "Sari",
    barang: "Speaker",
    kategori: "Elektronik",
    jumlah: 2,
    tanggal: "12 Agustus 2025",
  },
  {
    peminjam: "Doni",
    barang: "Kamera",
    kategori: "Elektronik",
    jumlah: 1,
    tanggal: "08 Agustus 2025",
  },
  {
    peminjam: "Maya",
    barang: "Microphone",
    kategori: "Elektronik",
    jumlah: 4,
    tanggal: "03 Agustus 2025",
  },
  // Data untuk bulan Januari
  {
    peminjam: "Ahmad",
    barang: "Komputer",
    kategori: "Elektronik",
    jumlah: 2,
    tanggal: "20 Januari 2025",
  },
  {
    peminjam: "Siti",
    barang: "Printer",
    kategori: "Elektronik",
    jumlah: 1,
    tanggal: "18 Januari 2025",
  },
  {
    peminjam: "Rina",
    barang: "Scanner",
    kategori: "Elektronik",
    jumlah: 1,
    tanggal: "15 Januari 2025",
  },
  // Data untuk bulan Maret
  {
    peminjam: "Dedi",
    barang: "Bola Basket",
    kategori: "Olahraga",
    jumlah: 5,
    tanggal: "25 Maret 2025",
  },
  {
    peminjam: "Nina",
    barang: "Raket Badminton",
    kategori: "Olahraga",
    jumlah: 3,
    tanggal: "22 Maret 2025",
  },
  {
    peminjam: "Bambang",
    barang: "Net Voli",
    kategori: "Olahraga",
    jumlah: 1,
    tanggal: "20 Maret 2025",
  },
  // Data untuk bulan Mei
  {
    peminjam: "Eva",
    barang: "Buku Matematika",
    kategori: "Buku",
    jumlah: 15,
    tanggal: "30 Mei 2025",
  },
  {
    peminjam: "Fajar",
    barang: "Buku Fisika",
    kategori: "Buku",
    jumlah: 12,
    tanggal: "28 Mei 2025",
  },
  {
    peminjam: "Gita",
    barang: "Buku Kimia",
    kategori: "Buku",
    jumlah: 10,
    tanggal: "25 Mei 2025",
  },
  // Data untuk bulan Juli
  {
    peminjam: "Hadi",
    barang: "Papan Tulis Digital",
    kategori: "Elektronik",
    jumlah: 2,
    tanggal: "10 Juli 2025",
  },
  {
    peminjam: "Indah",
    barang: "Tablet",
    kategori: "Elektronik",
    jumlah: 4,
    tanggal: "08 Juli 2025",
  },
  {
    peminjam: "Joko",
    barang: "Smart Board",
    kategori: "Elektronik",
    jumlah: 1,
    tanggal: "05 Juli 2025",
  },
  // Data untuk bulan September
  {
    peminjam: "Kartika",
    barang: "Alat Lab Biologi",
    kategori: "Alat",
    jumlah: 8,
    tanggal: "20 September 2025",
  },
  {
    peminjam: "Lukman",
    barang: "Mikroskop Digital",
    kategori: "Alat",
    jumlah: 3,
    tanggal: "18 September 2025",
  },
  {
    peminjam: "Mira",
    barang: "Termometer",
    kategori: "Alat",
    jumlah: 6,
    tanggal: "15 September 2025",
  },
  // Data untuk bulan November
  {
    peminjam: "Nando",
    barang: "Alat Musik",
    kategori: "Seni",
    jumlah: 5,
    tanggal: "25 November 2025",
  },
  {
    peminjam: "Oscar",
    barang: "Gitar",
    kategori: "Seni",
    jumlah: 2,
    tanggal: "22 November 2025",
  },
  {
    peminjam: "Putri",
    barang: "Piano",
    kategori: "Seni",
    jumlah: 1,
    tanggal: "20 November 2025",
  },
  // Data untuk tahun 2024
  {
    peminjam: "Qori",
    barang: "Laptop 2024",
    kategori: "Elektronik",
    jumlah: 2,
    tanggal: "15 Juni 2024",
  },
  {
    peminjam: "Rudi",
    barang: "Proyektor 2024",
    kategori: "Elektronik",
    jumlah: 1,
    tanggal: "10 Agustus 2024",
  },
  {
    peminjam: "Sinta",
    barang: "Buku 2024",
    kategori: "Buku",
    jumlah: 20,
    tanggal: "05 September 2024",
  },
];

const Peminjaman = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBulan, setSelectedBulan] = useState("06"); // Default Juni
  const [selectedTahun, setSelectedTahun] = useState("semua"); // Default Semua Tahun
  const itemsPerPage = 10;

  // Filter data berdasarkan bulan dan tahun
  const filteredData = dataPeminjaman.filter((item) => {
    const itemBulan = item.tanggal.split(" ")[1]; // Ambil bulan dari tanggal
    const itemTahun = item.tanggal.split(" ")[2]; // Ambil tahun dari tanggal

    // Mapping nama bulan ke angka
    const bulanMapping = {
      Januari: "01",
      Februari: "02",
      Maret: "03",
      April: "04",
      Mei: "05",
      Juni: "06",
      Juli: "07",
      Agustus: "08",
      September: "09",
      Oktober: "10",
      November: "11",
      Desember: "12",
    };

    const itemBulanAngka = bulanMapping[itemBulan];

    // Jika tahun "semua", hanya filter berdasarkan bulan
    if (selectedTahun === "semua") {
      return itemBulanAngka === selectedBulan;
    }

    return itemBulanAngka === selectedBulan && itemTahun === selectedTahun;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset halaman ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBulan, selectedTahun]);

  return (
    <div className="peminjaman-admin-wrapper">
      <div className="peminjaman-admin-container-full">
        <div className="peminjaman-admin-header">
          <h2 className="peminjaman-admin-title peminjaman-admin-title-blue">
            Peminjaman
          </h2>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </div>

        <div className="peminjaman-admin-card">
          <div className="peminjaman-admin-card-header">
            <span className="peminjaman-admin-card-title">
              Daftar Peminjaman
            </span>
            {/* Filter Bulan & Tahun */}
            <div className="peminjaman-admin-filter">
              <span className="peminjaman-admin-filter-label">Filter:</span>
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="peminjaman-admin-filter-select"
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <select
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className="peminjaman-admin-filter-select"
              >
                <option value="semua">Semua Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
          <div className="peminjaman-admin-table-wrapper">
            {filteredData.length > 0 ? (
              <>
                <table className="peminjaman-admin-table peminjaman-admin-table-blue">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Peminjam</th>
                      <th>Nama Barang</th>
                      <th>Kategori</th>
                      <th>Jumlah Barang</th>
                      <th>Tanggal Pengajuan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-center">
                          {indexOfFirst + idx + 1}
                        </td>
                        <td>{item.peminjam}</td>
                        <td>{item.barang}</td>
                        <td>{item.kategori}</td>
                        <td className="text-center">{item.jumlah}</td>
                        <td className="text-center">{item.tanggal}</td>
                        <td className="text-center">
                          <button
                            className="peminjaman-admin-btn-aksi peminjaman-admin-btn-tolak"
                            title="Tolak"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <button
                            className="peminjaman-admin-btn-aksi peminjaman-admin-btn-setujui"
                            title="Setujui"
                            style={{ marginLeft: "8px" }}
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="peminjaman-admin-pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="peminjaman-admin-pagination-btn"
                  >
                    {"<"}
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`peminjaman-admin-pagination-btn${
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
                    className="peminjaman-admin-pagination-btn"
                  >
                    {">"}
                  </button>
                </div>
              </>
            ) : (
              <div className="peminjaman-admin-no-data">
                <div className="peminjaman-admin-no-data-icon">
                  <i className="fa-solid fa-inbox"></i>
                </div>
                <h3 className="peminjaman-admin-no-data-title">
                  Data Tidak Ada
                </h3>
                <p className="peminjaman-admin-no-data-message">
                  Tidak ada data peminjaman untuk periode yang dipilih.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peminjaman;
