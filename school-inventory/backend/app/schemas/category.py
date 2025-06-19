# app/schemas/category.py
from typing import Optional
from pydantic import BaseModel

class CategoryBase(BaseModel):
    nama: str
    deskripsi: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    nama: Optional[str] = None
    deskripsi: Optional[str] = None

class CategoryInDBBase(CategoryBase):
    id: int

    class Config:
        orm_mode = True

class Category(CategoryInDBBase):
    pass