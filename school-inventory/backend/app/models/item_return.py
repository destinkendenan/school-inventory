# app/models/return.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base
import enum

class KondisiKembaliEnum(str, enum.Enum):
    baik = "Baik"
    rusak_ringan = "Rusak Ringan"
    rusak_berat = "Rusak Berat"

class Return(Base):
    __tablename__ = "returns"
    
    id = Column(Integer, primary_key=True, index=True)
    peminjaman_id = Column(Integer, ForeignKey("borrows.id"), unique=True, nullable=False)
    tanggalKembali = Column(DateTime(timezone=True), server_default=func.now())
    kondisiSaatKembali = Column(Enum(KondisiKembaliEnum), default=KondisiKembaliEnum.baik)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    peminjaman = relationship("Borrow", back_populates="pengembalian")