from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.sql import func

from app.database import Base


class ProductLink(Base):
    __tablename__ = "product_links"

    id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)

    link_type = Column(String(100))
    title = Column(String(255), nullable=False)
    url = Column(Text, nullable=False)

    created_at = Column(DateTime, server_default=func.now())