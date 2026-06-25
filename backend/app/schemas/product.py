from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    product_name: str
    symbol: str
    exchange: Optional[str] = None
    market: Optional[str] = None
    asset_class: Optional[str] = None
    description: Optional[str] = None

    is_maintained: bool = False
    has_databento_support: bool = False
    has_massive_support: bool = False

    preferred_source: Optional[str] = None
    maintainer: Optional[str] = None
    status: str = "active"


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    symbol: Optional[str] = None
    exchange: Optional[str] = None
    market: Optional[str] = None
    asset_class: Optional[str] = None
    description: Optional[str] = None

    is_maintained: Optional[bool] = None
    has_databento_support: Optional[bool] = None
    has_massive_support: Optional[bool] = None

    preferred_source: Optional[str] = None
    maintainer: Optional[str] = None
    status: Optional[str] = None


class ProductOut(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)