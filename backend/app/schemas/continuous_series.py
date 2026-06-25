from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ContinuousSeriesRuleCreate(BaseModel):
    rule_name: Optional[str] = None
    roll_method: Optional[str] = None
    roll_days_before_expiry: Optional[int] = None
    adjustment_method: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None


class ContinuousSeriesRuleUpdate(BaseModel):
    rule_name: Optional[str] = None
    roll_method: Optional[str] = None
    roll_days_before_expiry: Optional[int] = None
    adjustment_method: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None


class ContinuousSeriesRuleOut(BaseModel):
    id: int
    product_id: int
    rule_name: Optional[str] = None
    roll_method: Optional[str] = None
    roll_days_before_expiry: Optional[int] = None
    adjustment_method: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)