from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class SaleBase(BaseModel):
    product_id: str
    quantity: int
    total_price: float

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: str = Field(alias="_id")
    company_id: str
    date: datetime = Field(default_factory=datetime.now)
