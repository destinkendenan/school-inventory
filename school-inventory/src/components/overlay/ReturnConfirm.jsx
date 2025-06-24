import React from 'react';
import './ReturnConfirm.css';

const ReturnConfirm = ({ isOpen, item, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="return-confirm-overlay">
      <div className="return-confirm-modal">
        <div className="return-confirm-content">
          <h3>Konfirmasi Pengembalian</h3>
          <p>
            Apakah Anda yakin barang <strong>{item?.barang}</strong> telah dikembalikan oleh <strong>{item?.peminjam}</strong>?
          </p>
          <div className="return-confirm-actions">
            <button className="return-confirm-cancel" onClick={onClose}>
              Batal
            </button>
            <button className="return-confirm-return" onClick={onConfirm}>
              Kembalikan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirm;