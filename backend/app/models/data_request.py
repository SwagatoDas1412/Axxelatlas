from sqlalchemy import BigInteger, Column, Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.sql import func

from app.database import Base


class DataRequest(Base):
    __tablename__ = "data_requests"

    id = Column(BigInteger, primary_key=True, index=True)
    request_id = Column(String(100), nullable=False, unique=True, index=True)

    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"))

    request_type = Column(
        Enum("new_data", "backfill", "new_granularity", "data_issue", "other"),
        nullable=False,
        default="other",
    )

    data_type = Column(String(100))
    granularity = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)

    priority = Column(Enum("low", "medium", "high", "urgent"), default="medium")

    status = Column(
        Enum(
            "submitted",
            "under_review",
            "approved",
            "in_progress",
            "completed",
            "rejected",
            "duplicate",
            "needs_clarification",
        ),
        nullable=False,
        default="submitted",
    )

    description = Column(Text)
    admin_notes = Column(Text)
    assigned_to = Column(String(255))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())