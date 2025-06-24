import React from 'react';
import './DeleteConfirm.css';

const DeleteConfirm = ({ isOpen, item, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-modal">
        <div className="delete-confirm-content">
          <h3>Konfirmasi Hapus</h3>
          <p>
            Apakah Anda yakin ingin menghapus kategori <strong>{item?.nama}</strong>?
          </p>
          <p className="delete-confirm-warning">
            Tindakan ini tidak dapat dibatalkan!
          </p>
          <div className="delete-confirm-actions">
            <button className="delete-confirm-cancel" onClick={onClose}>
              Batal
            </button>
            <button className="delete-confirm-delete" onClick={onConfirm}>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;