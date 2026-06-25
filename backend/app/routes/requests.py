from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.database import get_db
from app.models.data_request import DataRequest
from app.models.product import Product
from app.models.user import User
from app.schemas.data_request import (
    DataRequestCreate,
    DataRequestOut,
    DataRequestUpdate,
)


router = APIRouter(prefix="/requests", tags=["requests"])


def generate_request_id() -> str:
    return f"REQ-{uuid4().hex[:8].upper()}"

def enrich_request(data_request: DataRequest, db: Session) -> dict:
    result = DataRequestOut.model_validate(data_request).model_dump()

    if data_request.product_id is not None:
        product = db.query(Product).filter(Product.id == data_request.product_id).first()
        if product is not None:
            result["product_name"] = product.product_name
            result["product_symbol"] = product.symbol

    user = db.query(User).filter(User.id == data_request.user_id).first()
    if user is not None:
        result["user_name"] = user.name
        result["user_email"] = user.email

    return result


@router.post("", response_model=DataRequestOut)
def create_data_request(
    payload: DataRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.product_id is not None:
        product = db.query(Product).filter(Product.id == payload.product_id).first()
        if product is None:
            raise HTTPException(status_code=404, detail="Product not found")

    data_request = DataRequest(
        request_id=generate_request_id(),
        user_id=current_user.id,
        product_id=payload.product_id,
        request_type=payload.request_type,
        data_type=payload.data_type,
        granularity=payload.granularity,
        start_date=payload.start_date,
        end_date=payload.end_date,
        priority=payload.priority,
        description=payload.description,
        status="submitted",
    )

    db.add(data_request)
    db.commit()
    db.refresh(data_request)

    return enrich_request(data_request, db)


@router.get("/my", response_model=List[DataRequestOut])
def get_my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data_requests =  (
        db.query(DataRequest)
        .filter(DataRequest.user_id == current_user.id)
        .order_by(DataRequest.created_at.desc())
        .all()
    )
    return [enrich_request(data_request, db) for data_request in data_requests]


@router.get("/{request_id}", response_model=DataRequestOut)
def get_request_by_request_id(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data_request = (
        db.query(DataRequest)
        .filter(DataRequest.request_id == request_id)
        .first()
    )

    if data_request is None:
        raise HTTPException(status_code=404, detail="Request not found")

    if current_user.role != "admin" and data_request.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to view this request")

    return enrich_request(data_request, db)


@router.get("", response_model=List[DataRequestOut])
def list_all_requests(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    data_requests =  db.query(DataRequest).order_by(DataRequest.created_at.desc()).all()
    return [enrich_request(data_request) for data_request in data_requests]


@router.put("/{request_id}", response_model=DataRequestOut)
def update_request(
    request_id: str,
    payload: DataRequestUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    data_request = (
        db.query(DataRequest)
        .filter(DataRequest.request_id == request_id)
        .first()
    )

    if data_request is None:
        raise HTTPException(status_code=404, detail="Request not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(data_request, key, value)

    db.commit()
    db.refresh(data_request)

    return enrich_request(data_request, db)