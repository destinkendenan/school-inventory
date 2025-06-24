# app/models/borrow.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base
import enum

class StatusEnum(str, enum.Enum):
    dipinjam = "Dipinjam"
    dikembalikan = "Dikembalikan"
    terlambat = "Terlambat"

class Borrow(Base):
    __tablename__ = "borrows"
    
    id = Column(Integer, primary_key=True, index=True)
    peminjam_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    barang_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    jumlahPinjam = Column(Integer, nullable=False)
    tanggalPinjam = Column(DateTime(timezone=True), server_default=func.now())
    tanggalKembali = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.dipinjam)
    catatan = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    peminjam = relationship("User")
    barang = relationship("Item", back_populates="peminjaman")