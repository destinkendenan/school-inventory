# app/api/endpoints/items.py
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, get_current_admin, get_db
from app.models.item import Item, KondisiEnum
from app.models.category import Category
from app.models.user import User
from app.schemas.item import Item as ItemSchema, ItemCreate, ItemUpdate, ItemWithCategory
from app.utils.response import response_success, response_error

router = APIRouter()

@router.get("/", response_model=List[ItemWithCategory])
def get_items(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    kondisi: Optional[KondisiEnum] = None
) -> Any:
    """
    Retrieve items with optional filtering
    """
    query = db.query(Item).options(joinedload(Item.kategori))
    
    # Apply filters if provided
    if category_id:
        query = query.filter(Item.kategori_id == category_id)
    if kondisi:
        query = query.filter(Item.kondisi == kondisi)
    
    items = query.offset(skip).limit(limit).all()
    
    # Format response with category name
    result = []
    for item in items:
        item_dict = {
            "id": item.id,
            "kodeBarang": item.kodeBarang,
            "namaBarang": item.namaBarang,
            "kategori_id": item.kategori_id,
            "jumlah": item.jumlah,
            "tersedia": item.tersedia,
            "dipinjam": item.dipinjam,
            "kondisi": item.kondisi,
            "deskripsi": item.deskripsi,
            "kategori": item.kategori.nama if item.kategori else None
        }
        result.append(item_dict)
    
    return result

@router.get("/{item_id}", response_model=ItemWithCategory)
def get_item_by_id(
    item_id: int = Path(..., title="The ID of the item to get"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific item by id
    """
    item = db.query(Item).options(joinedload(Item.kategori)).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )
    
    # Format response with category name
    result = {
        "id": item.id,
        "kodeBarang": item.kodeBarang,
        "namaBarang": item.namaBarang,
        "kategori_id": item.kategori_id,
        "jumlah": item.jumlah,
        "tersedia": item.tersedia,
        "dipinjam": item.dipinjam,
        "kondisi": item.kondisi,
        "deskripsi": item.deskripsi,
        "kategori": item.kategori.nama if item.kategori else None
    }
    
    return result

@router.post("/", response_model=ItemSchema)
def create_item(
    *,
    db: Session = Depends(get_db),
    item_in: ItemCreate,
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Create new item (admin only)
    """
    # Check if item with same code exists
    item = db.query(Item).filter(Item.kodeBarang == item_in.kodeBarang).first()
    if item:
        raise HTTPException(
            status_code=400,
            detail="Item with this code already exists"
        )
    
    # Check if category exists
    category = db.query(Category).filter(Category.id == item_in.kategori_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    # Create item with all available initially
    item = Item(
        **item_in.dict(),
        tersedia=item_in.jumlah,
        dipinjam=0
    )
    
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return item

@router.put("/{item_id}", response_model=ItemSchema)
def update_item(
    *,
    db: Session = Depends(get_db),
    item_id: int = Path(..., title="The ID of the item to update"),
    item_in: ItemUpdate,
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Update an item (admin only)
    """
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )
    
    # If category_id is provided, check if it exists
    if item_in.kategori_id:
        category = db.query(Category).filter(Category.id == item_in.kategori_id).first()
        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )
    
    # Update with special handling for jumlah
    update_data = item_in.dict(exclude_unset=True)
    
    # If updating jumlah, recalculate tersedia
    if "jumlah" in update_data:
        new_jumlah = update_data["jumlah"]
        
        # Ensure new quantity is not less than borrowed
        if new_jumlah < item.dipinjam:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot set quantity less than borrowed items ({item.dipinjam})"
            )
        
        # Update tersedia
        update_data["tersedia"] = new_jumlah - item.dipinjam
    
    for field in update_data:
        setattr(item, field, update_data[field])
    
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return item

@router.delete("/{item_id}", response_model=ItemSchema)
def delete_item(
    *,
    db: Session = Depends(get_db),
    item_id: int = Path(..., title="The ID of the item to delete"),
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Delete an item (admin only)
    """
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )
    
    # Cannot delete if items are borrowed
    if item.dipinjam > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete item with active borrows"
        )
    
    db.delete(item)
    db.commit()
    
    return item