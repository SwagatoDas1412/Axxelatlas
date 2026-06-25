from sqlalchemy import BigInteger, Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class ProductContractStatus(Base):
    __tablename__ = "product_contract_status"

    id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)

    active_contract = Column(String(100))
    active_contract_expiry = Column(Date)

    next_contract = Column(String(100))
    next_contract_expiry = Column(Date)

    days_to_expiry = Column(Integer)
    last_roll_date = Column(Date)
    next_expected_roll_date = Column(Date)

    source = Column(String(100))
    last_updated_at = Column(DateTime)
    notes = Column(Text)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())