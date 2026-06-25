from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DataAvailabilityCreate(BaseModel):
    data_type: str
    granularity: Optional[str] = None
    source: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    update_frequency: Optional[str] = None
    last_verified_at: Optional[datetime] = None
    notes: Optional[str] = None


class DataAvailabilityUpdate(BaseModel):
    data_type: Optional[str] = None
    granularity: Optional[str] = None
    source: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    update_frequency: Optional[str] = None
    last_verified_at: Optional[datetime] = None
    notes: Optional[str] = None


class DataAvailabilityOut(BaseModel):
    id: int
    product_id: int
    data_type: str
    granularity: Optional[str] = None
    source: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    update_frequency: Optional[str] = None
    last_verified_at: Optional[datetime] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)