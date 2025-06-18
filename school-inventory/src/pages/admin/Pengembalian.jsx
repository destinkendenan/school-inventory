// tampilan pengembalian admin
import React, { useState, useEffect } from "react";
import "../../index.css";
import DetailPengembalian from "../../components/overlay/DetailPengembalian";

const dataPengembalian = [
  {
    peminjam: "Rafly",
    barang: "kursi",
    kategori: "Alat",
    jumlah: 5,
    tanggal: "15 Juni 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Rafly",
    barang: "meja",
    kategori: "Alat",
    jumlah: 21,
    tanggal: "15 Juni 2025",
    status: "Terlambat",
  },
  {
    peminjam: "Lifsa",
    barang: "kabel HDMI",
    kategori: "Alat",
    jumlah: 22,
    tanggal: "12 Juni 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Kezia",
    barang: "mikroskop",
    kategori: "Alat",
    jumlah: 11,
    tanggal: "11 Juni 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Destin",
    barang: "kabel HDMI",
    kategori: "Alat",
    jumlah: 23,
    tanggal: "10 Juni 2025",
    status: "Terlambat",
  },
  {
    peminjam: "Tia",
    barang: "colokan mata 4",
    kategori: "Alat",
    jumlah: 100,
    tanggal: "09 Juni 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Sheryl",
    barang: "papan tulis",
    kategori: "Alat",
    jumlah: 32,
    tanggal: "05 Juni 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Agus",
    barang: "Proyektor",
    kategori: "Alat",
    jumlah: 98,
    tanggal: "04 Juni 2025",
    status: "Terlambat",
  },
  // Data tambahan bulan lain
  {
    peminjam: "Budi",
    barang: "Laptop",
    kategori: "Elektronik",
    jumlah: 3,
    tanggal: "15 Agustus 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Sari",
    barang: "Speaker",
    kategori: "Elektronik",
    jumlah: 2,
    tanggal: "12 Agustus 2025",
    status: "Sudah Dikembalikan",
  },
  {
    peminjam: "Doni",
    barang: "Kamera",
    kategori: "Elektronik",
    jumlah: 1,
    tanggal: "08 Agustus 2025",
    status: "Terlambat",
  },
  {
    peminjam: "Maya",
    barang: "Microphone",
    kategori: "Elektronik",
    jumlah: 4,
    tanggal: "03 Agustus 2025",
    status: "Sudah Dikembalikan",
  },
];

const Pengembalian = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBulan, setSelectedBulan] = useState("06");
  const [selectedTahun, setSelectedTahun] = useState("semua");
  const [modalData, setModalData] = useState(null);
  const itemsPerPage = 10;

  // Filter data berdasarkan bulan dan tahun
  const filteredData = dataPengembalian.filter((item) => {
    const itemBulan = item.tanggal.split(" ")[1];
    const itemTahun = item.tanggal.split(" ")[2];
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
    if (selectedTahun === "semua") {
      return itemBulanAngka === selectedBulan;
    }
    return itemBulanAngka === selectedBulan && itemTahun === selectedTahun;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBulan, selectedTahun]);

  return (
    <div className="pengembalian-admin-wrapper">
      <div className="pengembalian-admin-container-full">
        <div className="pengembalian-admin-header">
          <h2 className="pengembalian-admin-title pengembalian-admin-title-blue">
            Pengembalian
          </h2>
          <div className="dashboard-admin-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="avatar"
              className="dashboard-admin-avatar-img"
            />
          </div>
        </div>
        <div className="pengembalian-admin-card">
          <div className="pengembalian-admin-card-header">
            <span className="pengembalian-admin-card-title">
              Daftar Pengembalian
            </span>
            <div className="pengembalian-admin-filter">
              <span className="pengembalian-admin-filter-label">Filter:</span>
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="pengembalian-admin-filter-select"
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
                className="pengembalian-admin-filter-select"
              >
                <option value="semua">Semua Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
          <div className="pengembalian-admin-table-wrapper">
            {filteredData.length > 0 ? (
              <>
                <table className="pengembalian-admin-table pengembalian-admin-table-blue">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Peminjam</th>
                      <th>Nama Barang</th>
                      <th>Kategori</th>
                      <th>Jumlah Barang</th>
                      <th>Tanggal Pengembalian</th>
                      <th>Status</th>
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
                          <span
                            className={`pengembalian-admin-status ${
                              item.status === "Sudah Dikembalikan"
                                ? "success"
                                : "late"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="pengembalian-admin-btn-detail"
                            onClick={() => setModalData(item)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="pengembalian-admin-pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="pengembalian-admin-pagination-btn"
                  >
                    {"<"}
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`pengembalian-admin-pagination-btn${
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
                    className="pengembalian-admin-pagination-btn"
                  >
                    {">"}
                  </button>
                </div>
              </>
            ) : (
              <div className="pengembalian-admin-no-data">
                <div className="pengembalian-admin-no-data-icon">
                  <i className="fa-solid fa-inbox"></i>
                </div>
                <h3 className="pengembalian-admin-no-data-title">
                  Data Tidak Ada
                </h3>
                <p className="pengembalian-admin-no-data-message">
                  Tidak ada data pengembalian untuk periode yang dipilih.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalData && (
        <DetailPengembalian
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default Pengembalian;
// akhir tampilan pengembalian admin
