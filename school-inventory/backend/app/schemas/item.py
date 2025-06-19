# app/schemas/item.py
from typing import Optional
from pydantic import BaseModel
from app.models.item import KondisiEnum

class ItemBase(BaseModel):
    kodeBarang: str
    namaBarang: str
    kategori_id: int
    jumlah: int
    deskripsi: Optional[str] = None
    kondisi: KondisiEnum = KondisiEnum.baik

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    namaBarang: Optional[str] = None
    kategori_id: Optional[int] = None
    jumlah: Optional[int] = None
    deskripsi: Optional[str] = None
    kondisi: Optional[KondisiEnum] = None

class ItemInDBBase(ItemBase):
    id: int
    tersedia: int
    dipinjam: int

    class Config:
        orm_mode = True

class Item(ItemInDBBase):
    pass

class ItemWithCategory(Item):
    kategori: str