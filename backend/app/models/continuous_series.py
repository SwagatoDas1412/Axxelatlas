from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class ContinuousSeriesRule(Base):
    __tablename__ = "continuous_series_rules"

    id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)

    rule_name = Column(String(255))
    roll_method = Column(String(100))
    roll_days_before_expiry = Column(Integer)
    adjustment_method = Column(String(100))
    description = Column(Text)
    notes = Column(Text)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())