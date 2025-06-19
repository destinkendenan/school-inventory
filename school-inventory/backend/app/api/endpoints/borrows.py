# app/api/endpoints/borrows.py
from typing import Any, List, Optional
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from app.api.deps import get_current_user, get_current_admin, get_db
from app.models.borrow import Borrow, StatusEnum
from app.models.item import Item
from app.models.user import User
from app.schemas.borrow import Borrow as BorrowSchema, BorrowCreate, BorrowUpdate, BorrowWithDetails
from app.utils.response import response_success, response_error

router = APIRouter()

@router.get("/", response_model=List[BorrowWithDetails])
def get_borrows(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
) -> Any:
    """
    Retrieve borrows (admin sees all, users see only their own)
    """
    query = db.query(Borrow).options(
        joinedload(Borrow.peminjam),
        joinedload(Borrow.barang)
    )
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.filter(Borrow.peminjam_id == current_user.id)
    
    borrows = query.offset(skip).limit(limit).all()
    
    # Format response with detailed info
    result = []
    for borrow in borrows:
        borrow_dict = {
            "id": borrow.id,
            "peminjam_id": borrow.peminjam_id,
            "barang_id": borrow.barang_id,
            "jumlahPinjam": borrow.jumlahPinjam,
            "tanggalPinjam": borrow.tanggalPinjam,
            "tanggalKembali": borrow.tanggalKembali,
            "status": borrow.status,
            "catatan": borrow.catatan,
            "peminjam": {
                "id": borrow.peminjam.id,
                "username": borrow.peminjam.username,
                "nama": borrow.peminjam.nama
            },
            "barang": {
                "id": borrow.barang.id,
                "kodeBarang": borrow.barang.kodeBarang,
                "namaBarang": borrow.barang.namaBarang
            }
        }
        result.append(borrow_dict)
    
    return result

@router.get("/{borrow_id}", response_model=BorrowWithDetails)
def get_borrow_by_id(
    borrow_id: int = Path(..., title="The ID of the borrow to get"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific borrow by id
    """
    borrow = db.query(Borrow).options(
        joinedload(Borrow.peminjam),
        joinedload(Borrow.barang)
    ).filter(Borrow.id == borrow_id).first()
    
    if not borrow:
        raise HTTPException(
            status_code=404,
            detail="Borrow not found"
        )
    
    # Check permission (admin or own borrow)
    if current_user.role != "admin" and borrow.peminjam_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Format response with detailed info
    result = {
        "id": borrow.id,
        "peminjam_id": borrow.peminjam_id,
        "barang_id": borrow.barang_id,
        "jumlahPinjam": borrow.jumlahPinjam,
        "tanggalPinjam": borrow.tanggalPinjam,
        "tanggalKembali": borrow.tanggalKembali,
        "status": borrow.status,
        "catatan": borrow.catatan,
        "peminjam": {
            "id": borrow.peminjam.id,
            "username": borrow.peminjam.username,
            "nama": borrow.peminjam.nama
        },
        "barang": {
            "id": borrow.barang.id,
            "kodeBarang": borrow.barang.kodeBarang,
            "namaBarang": borrow.barang.namaBarang
        }
    }
    
    return result

@router.post("/", response_model=BorrowSchema)
def create_borrow(
    *,
    db: Session = Depends(get_db),
    borrow_in: BorrowCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create new borrow
    """
    # Check if item exists
    item = db.query(Item).filter(Item.id == borrow_in.barang_id).first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )
    
    # Check if quantity is available
    if item.tersedia < borrow_in.jumlahPinjam:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough items available. Only {item.tersedia} available."
        )
    
    # Validate return date (must be in the future)
    # PERBAIKAN: Gunakan datetime.now(timezone.utc) untuk mendapatkan datetime dengan timezone
    if borrow_in.tanggalKembali <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="Return date must be in the future"
        )
    
    # Create borrow record
    borrow = Borrow(
        peminjam_id=current_user.id,
        barang_id=borrow_in.barang_id,
        jumlahPinjam=borrow_in.jumlahPinjam,
        tanggalKembali=borrow_in.tanggalKembali,
        status=StatusEnum.dipinjam,
        catatan=borrow_in.catatan
    )
    
    # Update item availability
    item.tersedia -= borrow_in.jumlahPinjam
    item.dipinjam += borrow_in.jumlahPinjam
    
    db.add(borrow)
    db.add(item)
    db.commit()
    db.refresh(borrow)
    
    return borrow

@router.patch("/{borrow_id}", response_model=BorrowSchema)
def update_borrow(
    *,
    db: Session = Depends(get_db),
    borrow_id: int = Path(..., title="The ID of the borrow to update"),
    borrow_in: BorrowUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update a borrow (only status can be updated by admin)
    """
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()
    if not borrow:
        raise HTTPException(
            status_code=404,
            detail="Borrow not found"
        )
    
    # Regular users can only update their own borrows and only for certain fields
    if current_user.role != "admin":
        if borrow.peminjam_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions"
            )
        
        # Regular users can't change status
        if borrow_in.status:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions to change status"
            )
    
    # Update only allowed fields
    update_data = borrow_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(borrow, field, update_data[field])
    
    db.add(borrow)
    db.commit()
    db.refresh(borrow)
    
    return borrow

@router.delete("/{borrow_id}", response_model=BorrowSchema)
def delete_borrow(
    *,
    db: Session = Depends(get_db),
    borrow_id: int = Path(..., title="The ID of the borrow to delete"),
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Delete a borrow (admin only)
    """
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()
    if not borrow:
        raise HTTPException(
            status_code=404,
            detail="Borrow not found"
        )
    
    # If borrow is active, update item availability
    if borrow.status == StatusEnum.dipinjam:
        item = db.query(Item).filter(Item.id == borrow.barang_id).first()
        if item:
            item.tersedia += borrow.jumlahPinjam
            item.dipinjam -= borrow.jumlahPinjam
            db.add(item)
    
    db.delete(borrow)
    db.commit()
    
    return borrow