# app/schemas/borrow.py
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.borrow import StatusEnum

class BorrowBase(BaseModel):
    barang_id: int
    jumlahPinjam: int
    tanggalKembali: datetime
    catatan: Optional[str] = None

class BorrowCreate(BorrowBase):
    pass

class BorrowUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    tanggalKembali: Optional[datetime] = None
    catatan: Optional[str] = None

class BorrowInDBBase(BorrowBase):
    id: int
    peminjam_id: int
    tanggalPinjam: datetime
    status: StatusEnum

    class Config:
        orm_mode = True

class Borrow(BorrowInDBBase):
    pass

class BorrowWithDetails(Borrow):
    peminjam: Dict[str, Any]
    barang: Dict[str, Any]