from pydantic import BaseModel, Field
from typing import Optional


class Product(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    company_id: str
    created_at: str
    updated_at: str


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
