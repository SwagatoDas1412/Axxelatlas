from sqlalchemy import BigInteger, Boolean, Column, DateTime, Enum, String, Text
from sqlalchemy.sql import func

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, index=True)

    product_name = Column(String(255), nullable=False)
    symbol = Column(String(100), nullable=False, index=True)
    exchange = Column(String(100))
    market = Column(String(100), index=True)
    asset_class = Column(String(100), index=True)
    description = Column(Text)

    is_maintained = Column(Boolean, nullable=False, default=False)
    has_databento_support = Column(Boolean, nullable=False, default=False)
    has_massive_support = Column(Boolean, nullable=False, default=False)

    preferred_source = Column(String(100))
    maintainer = Column(String(255))
    status = Column(
        Enum("active", "deprecated", "experimental"),
        nullable=False,
        default="active",
    )

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())