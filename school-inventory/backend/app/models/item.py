# app/models/item.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base
import enum

class KondisiEnum(str, enum.Enum):
    baik = "Baik"
    rusak_ringan = "Rusak Ringan"
    rusak_berat = "Rusak Berat"

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    kodeBarang = Column(String(50), unique=True, index=True, nullable=False)
    namaBarang = Column(String(100), nullable=False)
    kategori_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    jumlah = Column(Integer, default=0)
    tersedia = Column(Integer, default=0)
    dipinjam = Column(Integer, default=0)
    kondisi = Column(Enum(KondisiEnum), default=KondisiEnum.baik)
    deskripsi = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    kategori = relationship("Category", back_populates="items")
    peminjaman = relationship("Borrow", back_populates="barang")