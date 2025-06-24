# app/api/api.py
from fastapi import APIRouter

from app.api.endpoints import auth, users, categories, items, borrows
api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(items.router, prefix="/items", tags=["Items"])
api_router.include_router(borrows.router, prefix="/borrows", tags=["Borrows"])