import React, { useState } from "react";
import "../../index.css";

const modalStyle = `
.pengembalian-admin-modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(30, 41, 59, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pengembalian-admin-modal {
  background: #fff;
  border-radius: 14px;
  padding: 32px 28px 24px 28px;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(26, 35, 126, 0.18);
  text-align: left;
  position: relative;
  animation: fadeIn 0.2s;
}
.pengembalian-admin-modal h3 {
  margin-top: 0;
  color: #1a237e;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 18px;
}
.pengembalian-admin-modal-table {
  width: 100%;
  margin-bottom: 18px;
  border-collapse: collapse;
  background: #fff;
}
.pengembalian-admin-modal-table td {
  padding: 7px 10px;
  font-size: 1rem;
  color: #222;
  border-bottom: 1px solid #e0e0e0;
  background: #fff !important;
}
.pengembalian-admin-modal-table td:first-child {
  font-weight: 600;
  color: #1a237e;
  width: 140px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}
`;

const DetailPengembalian = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <>
      <style>{modalStyle}</style>
      <div className="pengembalian-admin-modal-backdrop" onClick={onClose}>
        <div
          className="pengembalian-admin-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Detail Pengembalian</h3>
          <table className="pengembalian-admin-modal-table">
            <tbody>
              <tr>
                <td>Nama Peminjam</td>
                <td>{data.peminjam}</td>
              </tr>
              <tr>
                <td>Nama Barang</td>
                <td>{data.barang}</td>
              </tr>
              <tr>
                <td>Kategori</td>
                <td>{data.kategori}</td>
              </tr>
              <tr>
                <td>Jumlah Barang</td>
                <td>{data.jumlah}</td>
              </tr>
              <tr>
                <td>Tanggal Pengembalian</td>
                <td>{data.tanggal}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>
                  <span
                    className={`pengembalian-admin-status ${
                      data.status === "Sudah Dikembalikan" ? "success" : "late"
                    }`}
                  >
                    {data.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="pengembalian-admin-btn-detail" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailPengembalian;
