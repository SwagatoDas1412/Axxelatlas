from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductContractStatusCreate(BaseModel):
    active_contract: Optional[str] = None
    active_contract_expiry: Optional[date] = None

    next_contract: Optional[str] = None
    next_contract_expiry: Optional[date] = None

    days_to_expiry: Optional[int] = None
    last_roll_date: Optional[date] = None
    next_expected_roll_date: Optional[date] = None

    source: Optional[str] = None
    last_updated_at: Optional[datetime] = None
    notes: Optional[str] = None


class ProductContractStatusUpdate(BaseModel):
    active_contract: Optional[str] = None
    active_contract_expiry: Optional[date] = None

    next_contract: Optional[str] = None
    next_contract_expiry: Optional[date] = None

    days_to_expiry: Optional[int] = None
    last_roll_date: Optional[date] = None
    next_expected_roll_date: Optional[date] = None

    source: Optional[str] = None
    last_updated_at: Optional[datetime] = None
    notes: Optional[str] = None


class ProductContractStatusOut(BaseModel):
    id: int
    product_id: int

    active_contract: Optional[str] = None
    active_contract_expiry: Optional[date] = None

    next_contract: Optional[str] = None
    next_contract_expiry: Optional[date] = None

    days_to_expiry: Optional[int] = None
    last_roll_date: Optional[date] = None
    next_expected_roll_date: Optional[date] = None

    source: Optional[str] = None
    last_updated_at: Optional[datetime] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)