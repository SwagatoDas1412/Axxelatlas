from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductLinkCreate(BaseModel):
    link_type: Optional[str] = None
    title: str
    url: str


class ProductLinkUpdate(BaseModel):
    link_type: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None


class ProductLinkOut(BaseModel):
    id: int
    product_id: int
    link_type: Optional[str] = None
    title: str
    url: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)