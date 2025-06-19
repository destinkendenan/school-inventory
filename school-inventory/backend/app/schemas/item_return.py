# app/schemas/return.py
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.item_return import KondisiKembaliEnum

class ReturnBase(BaseModel):
    peminjaman_id: int
    kondisiSaatKembali: KondisiKembaliEnum = KondisiKembaliEnum.baik

class ReturnCreate(ReturnBase):
    pass

class ReturnUpdate(BaseModel):
    kondisiSaatKembali: Optional[KondisiKembaliEnum] = None

class ReturnInDBBase(ReturnBase):
    id: int
    tanggalKembali: datetime

    class Config:
        orm_mode = True

class Return(ReturnInDBBase):
    pass

class ReturnWithDetails(Return):
    peminjaman: Dict[str, Any]