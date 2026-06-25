from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DataRequestCreate(BaseModel):
    product_id: Optional[int] = None

    request_type: str = "other"
    data_type: Optional[str] = None
    granularity: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    priority: str = "medium"
    description: Optional[str] = None


class DataRequestUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None
    priority: Optional[str] = None


class DataRequestOut(BaseModel):
    id: int
    request_id: str
    user_id: int
    product_id: Optional[int] = None

    request_type: str
    data_type: Optional[str] = None
    granularity: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    priority: Optional[str] = None
    status: str
    description: Optional[str] = None
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    product_name: Optional[str] = None
    product_symbol: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)