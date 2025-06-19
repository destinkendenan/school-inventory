# app/api/endpoints/returns.py
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, get_current_admin, get_db
from app.models.item_return import Return, KondisiKembaliEnum
from app.models.borrow import Borrow, StatusEnum
from app.models.item import Item
from app.models.user import User
from app.schemas.item_return import Return as ReturnSchema, ReturnCreate, ReturnUpdate, ReturnWithDetails
from app.utils.response import response_success, response_error

router = APIRouter()

@router.get("/", response_model=List[ReturnWithDetails])
def get_returns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve returns (admin sees all, users see only their own)
    """
    # Query with joins to get all related data
    query = db.query(Return).options(
        joinedload(Return.peminjaman).joinedload(Borrow.peminjam),
        joinedload(Return.peminjaman).joinedload(Borrow.barang)
    )
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.join(Borrow, Return.peminjaman_id == Borrow.id).filter(
            Borrow.peminjam_id == current_user.id
        )
    
    returns = query.all()
    
    # Format response with detailed info
    result = []
    for return_ in returns:
        borrow = return_.peminjaman
        return_dict = {
            "id": return_.id,
            "peminjaman_id": return_.peminjaman_id,
            "tanggalKembali": return_.tanggalKembali,
            "kondisiSaatKembali": return_.kondisiSaatKembali,
            "peminjaman": {
                "id": borrow.id,
                "jumlahPinjam": borrow.jumlahPinjam,
                "tanggalPinjam": borrow.tanggalPinjam,
                "tanggalKembali": borrow.tanggalKembali,
                "status": borrow.status,
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
        }
        result.append(return_dict)
    
    return result

@router.get("/{return_id}", response_model=ReturnWithDetails)
def get_return_by_id(
    return_id: int = Path(..., title="The ID of the return to get"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific return by id
    """
    return_ = db.query(Return).options(
        joinedload(Return.peminjaman).joinedload(Borrow.peminjam),
        joinedload(Return.peminjaman).joinedload(Borrow.barang)
    ).filter(Return.id == return_id).first()
    
    if not return_:
        raise HTTPException(
            status_code=404,
            detail="Return not found"
        )
    
    # Check permission (admin or own return)
    borrow = return_.peminjaman
    if current_user.role != "admin" and borrow.peminjam_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Format response with detailed info
    result = {
        "id": return_.id,
        "peminjaman_id": return_.peminjaman_id,
        "tanggalKembali": return_.tanggalKembali,
        "kondisiSaatKembali": return_.kondisiSaatKembali,
        "peminjaman": {
            "id": borrow.id,
            "jumlahPinjam": borrow.jumlahPinjam,
            "tanggalPinjam": borrow.tanggalPinjam,
            "tanggalKembali": borrow.tanggalKembali,
            "status": borrow.status,
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
    }
    
    return result

@router.post("/", response_model=ReturnSchema)
def create_return(
    *,
    db: Session = Depends(get_db),
    return_in: ReturnCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create new return (return borrowed items)
    """
    # Check if borrow exists
    borrow = db.query(Borrow).filter(Borrow.id == return_in.peminjaman_id).first()
    if not borrow:
        raise HTTPException(
            status_code=404,
            detail="Borrow not found"
        )
    
    # Check if already returned
    existing_return = db.query(Return).filter(Return.peminjaman_id == return_in.peminjaman_id).first()
    if existing_return:
        raise HTTPException(
            status_code=400,
            detail="This borrow has already been returned"
        )
    
    # Check if user is allowed to return (admin or owner)
    if current_user.role != "admin" and borrow.peminjam_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Check if borrow is in 'Dipinjam' status
    if borrow.status != StatusEnum.dipinjam:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot return borrow with status {borrow.status}"
        )
    
    # Create return record
    return_ = Return(
        peminjaman_id=return_in.peminjaman_id,
        kondisiSaatKembali=return_in.kondisiSaatKembali
    )
    
    # Update borrow status
    borrow.status = StatusEnum.dikembalikan
    
    # Update item availability
    item = db.query(Item).filter(Item.id == borrow.barang_id).first()
    if item:
        item.tersedia += borrow.jumlahPinjam
        item.dipinjam -= borrow.jumlahPinjam
        db.add(item)
    
    db.add(return_)
    db.add(borrow)
    db.commit()
    db.refresh(return_)
    
    return return_

@router.patch("/{return_id}", response_model=ReturnSchema)
def update_return(
    *,
    db: Session = Depends(get_db),
    return_id: int = Path(..., title="The ID of the return to update"),
    return_in: ReturnUpdate,
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Update a return (admin only)
    """
    return_ = db.query(Return).filter(Return.id == return_id).first()
    if not return_:
        raise HTTPException(
            status_code=404,
            detail="Return not found"
        )
    
    # Update only allowed fields
    update_data = return_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(return_, field, update_data[field])
    
    db.add(return_)
    db.commit()
    db.refresh(return_)
    
    return return_

@router.delete("/{return_id}", response_model=ReturnSchema)
def delete_return(
    *,
    db: Session = Depends(get_db),
    return_id: int = Path(..., title="The ID of the return to delete"),
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Delete a return (admin only)
    """
    return_ = db.query(Return).filter(Return.id == return_id).first()
    if not return_:
        raise HTTPException(
            status_code=404,
            detail="Return not found"
        )
    
    # Get associated borrow
    borrow = db.query(Borrow).filter(Borrow.id == return_.peminjaman_id).first()
    
    # Change borrow status back to dipinjam
    if borrow:
        borrow.status = StatusEnum.dipinjam
        
        # Update item availability
        item = db.query(Item).filter(Item.id == borrow.barang_id).first()
        if item:
            item.tersedia -= borrow.jumlahPinjam
            item.dipinjam += borrow.jumlahPinjam
            db.add(item)
        
        db.add(borrow)
    
    db.delete(return_)
    db.commit()
    
    return return_