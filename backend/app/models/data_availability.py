from sqlalchemy import BigInteger, Column, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.sql import func

from app.database import Base


class ProductDataAvailability(Base):
    __tablename__ = "product_data_availability"

    id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)

    data_type = Column(String(100), nullable=False)
    granularity = Column(String(100))
    source = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    update_frequency = Column(String(100))
    last_verified_at = Column(DateTime)
    notes = Column(Text)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())