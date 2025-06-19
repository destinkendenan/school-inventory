# app/api/endpoints/categories.py
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_admin, get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.utils.response import response_success, response_error

router = APIRouter()

@router.get("/", response_model=List[CategorySchema])
def get_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve categories
    """
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories

@router.get("/{category_id}", response_model=CategorySchema)
def get_category_by_id(
    category_id: int = Path(..., title="The ID of the category to get"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific category by id
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    return category

@router.post("/", response_model=CategorySchema)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Create new category (admin only)
    """
    # Check if category with same name exists
    category = db.query(Category).filter(Category.nama == category_in.nama).first()
    if category:
        raise HTTPException(
            status_code=400,
            detail="Category with this name already exists"
        )
    
    category = Category(**category_in.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category

@router.put("/{category_id}", response_model=CategorySchema)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: int = Path(..., title="The ID of the category to update"),
    category_in: CategoryUpdate,
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Update a category (admin only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    # If trying to update name, check if it already exists
    if category_in.nama and category_in.nama != category.nama:
        existing = db.query(Category).filter(Category.nama == category_in.nama).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Category with this name already exists"
            )
    
    update_data = category_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(category, field, update_data[field])
    
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category

@router.delete("/{category_id}", response_model=CategorySchema)
def delete_category(
    *,
    db: Session = Depends(get_db),
    category_id: int = Path(..., title="The ID of the category to delete"),
    current_user: User = Depends(get_current_admin)
) -> Any:
    """
    Delete a category (admin only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    # Check if category has items
    if category.items:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category with existing items"
        )
    
    db.delete(category)
    db.commit()
    
    return category