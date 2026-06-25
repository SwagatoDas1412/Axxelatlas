from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.database import get_db
from app.models.continuous_series import ContinuousSeriesRule
from app.models.contract_status import ProductContractStatus
from app.models.data_availability import ProductDataAvailability
from app.models.data_request import DataRequest
from app.models.product import Product
from app.models.product_link import ProductLink
from app.models.user import User
from app.schemas.continuous_series import (
    ContinuousSeriesRuleCreate,
    ContinuousSeriesRuleOut,
    ContinuousSeriesRuleUpdate,
)
from app.schemas.contract_status import (
    ProductContractStatusCreate,
    ProductContractStatusOut,
    ProductContractStatusUpdate,
)
from app.schemas.data_availability import (
    DataAvailabilityCreate,
    DataAvailabilityOut,
    DataAvailabilityUpdate,
)
from app.schemas.data_request import DataRequestOut, DataRequestUpdate
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate
from app.schemas.product_link import (
    ProductLinkCreate,
    ProductLinkOut,
    ProductLinkUpdate,
)
from app.routes.requests import enrich_request


router = APIRouter(prefix="/admin", tags=["admin"])

def get_product_or_404(product_id: int, db: Session) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

@router.post("/products", response_model=ProductOut)
def create_product(
    payload: ProductCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing_product = db.query(Product).filter(Product.symbol == payload.symbol).first()

    if existing_product is not None:
        raise HTTPException(
            status_code=400,
            detail="Product with this symbol already exists",
        )

    product = Product(**payload.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


@router.get("/requests", response_model=List[DataRequestOut])
def list_admin_requests(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    data_requests =  db.query(DataRequest).order_by(DataRequest.created_at.desc()).all()
    return [enrich_request(data_request, db) for data_request in data_requests]


@router.put("/requests/{request_id}", response_model=DataRequestOut)
def update_admin_request(
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

@router.post(
    "/products/{product_id}/data-availability",
    response_model=DataAvailabilityOut,
)
def create_data_availability(
    product_id: int,
    payload: DataAvailabilityCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    get_product_or_404(product_id, db)

    availability = ProductDataAvailability(
        product_id=product_id,
        **payload.model_dump(),
    )

    db.add(availability)
    db.commit()
    db.refresh(availability)

    return availability


@router.put(
    "/data-availability/{availability_id}",
    response_model=DataAvailabilityOut,
)
def update_data_availability(
    availability_id: int,
    payload: DataAvailabilityUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    availability = (
        db.query(ProductDataAvailability)
        .filter(ProductDataAvailability.id == availability_id)
        .first()
    )

    if availability is None:
        raise HTTPException(status_code=404, detail="Data availability not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(availability, key, value)

    db.commit()
    db.refresh(availability)

    return availability

@router.post(
    "/products/{product_id}/links",
    response_model=ProductLinkOut,
)
def create_product_link(
    product_id: int,
    payload: ProductLinkCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    get_product_or_404(product_id, db)

    link = ProductLink(
        product_id=product_id,
        **payload.model_dump(),
    )

    db.add(link)
    db.commit()
    db.refresh(link)

    return link


@router.put(
    "/product-links/{link_id}",
    response_model=ProductLinkOut,
)
def update_product_link(
    link_id: int,
    payload: ProductLinkUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    link = db.query(ProductLink).filter(ProductLink.id == link_id).first()

    if link is None:
        raise HTTPException(status_code=404, detail="Product link not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(link, key, value)

    db.commit()
    db.refresh(link)

    return link

@router.post(
    "/products/{product_id}/continuous-series-rules",
    response_model=ContinuousSeriesRuleOut,
)
def create_continuous_series_rule(
    product_id: int,
    payload: ContinuousSeriesRuleCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    get_product_or_404(product_id, db)

    rule = ContinuousSeriesRule(
        product_id=product_id,
        **payload.model_dump(),
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    return rule


@router.put(
    "/continuous-series-rules/{rule_id}",
    response_model=ContinuousSeriesRuleOut,
)
def update_continuous_series_rule(
    rule_id: int,
    payload: ContinuousSeriesRuleUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rule = db.query(ContinuousSeriesRule).filter(ContinuousSeriesRule.id == rule_id).first()

    if rule is None:
        raise HTTPException(status_code=404, detail="Continuous series rule not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(rule, key, value)

    db.commit()
    db.refresh(rule)

    return rule

@router.post(
    "/products/{product_id}/contract-status",
    response_model=ProductContractStatusOut,
)
def create_contract_status(
    product_id: int,
    payload: ProductContractStatusCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    get_product_or_404(product_id, db)

    existing_status = (
        db.query(ProductContractStatus)
        .filter(ProductContractStatus.product_id == product_id)
        .first()
    )

    if existing_status is not None:
        raise HTTPException(
            status_code=400,
            detail="Contract status already exists for this product. Use PUT to update it.",
        )

    contract_status = ProductContractStatus(
        product_id=product_id,
        **payload.model_dump(),
    )

    db.add(contract_status)
    db.commit()
    db.refresh(contract_status)

    return contract_status


@router.put(
    "/contract-status/{contract_status_id}",
    response_model=ProductContractStatusOut,
)
def update_contract_status(
    contract_status_id: int,
    payload: ProductContractStatusUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    contract_status = (
        db.query(ProductContractStatus)
        .filter(ProductContractStatus.id == contract_status_id)
        .first()
    )

    if contract_status is None:
        raise HTTPException(status_code=404, detail="Contract status not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(contract_status, key, value)

    db.commit()
    db.refresh(contract_status)

    return contract_status

@router.delete("/data-availability/{availability_id}")
def delete_data_availability(
    availability_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    availability = (
        db.query(ProductDataAvailability)
        .filter(ProductDataAvailability.id == availability_id)
        .first()
    )

    if availability is None:
        raise HTTPException(status_code=404, detail="Data availability not found")

    db.delete(availability)
    db.commit()

    return {"message": "Data availability deleted successfully"}


@router.delete("/product-links/{link_id}")
def delete_product_link(
    link_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    link = db.query(ProductLink).filter(ProductLink.id == link_id).first()

    if link is None:
        raise HTTPException(status_code=404, detail="Product link not found")

    db.delete(link)
    db.commit()

    return {"message": "Product link deleted successfully"}


@router.delete("/continuous-series-rules/{rule_id}")
def delete_continuous_series_rule(
    rule_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rule = db.query(ContinuousSeriesRule).filter(ContinuousSeriesRule.id == rule_id).first()

    if rule is None:
        raise HTTPException(status_code=404, detail="Continuous series rule not found")

    db.delete(rule)
    db.commit()

    return {"message": "Continuous series rule deleted successfully"}