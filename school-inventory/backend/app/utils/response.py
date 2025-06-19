# app/utils/response.py
from typing import Any, Dict, Generic, List, Optional, TypeVar, Union
from pydantic import BaseModel
from fastapi import status

T = TypeVar('T')

class ResponseSchema(BaseModel, Generic[T]):
    status_code: int = status.HTTP_200_OK
    message: str = "Success"
    data: Optional[T] = None

def response_success(data: Any = None, message: str = "Success", status_code: int = status.HTTP_200_OK):
    return ResponseSchema(
        status_code=status_code,
        message=message,
        data=data
    )

def response_error(message: str = "Error", status_code: int = status.HTTP_400_BAD_REQUEST):
    return ResponseSchema(
        status_code=status_code,
        message=message,
        data=None
    )