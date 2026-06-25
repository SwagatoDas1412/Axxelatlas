from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductOut
from app.models.continuous_series import ContinuousSeriesRule
from app.models.contract_status import ProductContractStatus
from app.models.data_availability import ProductDataAvailability
from app.models.product_link import ProductLink
from app.schemas.continuous_series import ContinuousSeriesRuleOut
from app.schemas.contract_status import ProductContractStatusOut
from app.schemas.data_availability import DataAvailabilityOut
from app.schemas.product_link import ProductLinkOut

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductOut])
def list_products(
    search: Optional[str] = Query(default=None),
    market: Optional[str] = Query(default=None),
    exchange: Optional[str] = Query(default=None),
    asset_class: Optional[str] = Query(default=None),
    is_maintained: Optional[bool] = Query(default=None),
    has_databento_support: Optional[bool] = Query(default=None),
    has_massive_support: Optional[bool] = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.product_name.like(search_pattern))
            | (Product.symbol.like(search_pattern))
            | (Product.description.like(search_pattern))
        )

    if market:
        query = query.filter(Product.market == market)

    if exchange:
        query = query.filter(Product.exchange == exchange)

    if asset_class:
        query = query.filter(Product.asset_class == asset_class)

    if is_maintained is not None:
        query = query.filter(Product.is_maintained == is_maintained)

    if has_databento_support is not None:
        query = query.filter(Product.has_databento_support == has_databento_support)

    if has_massive_support is not None:
        query = query.filter(Product.has_massive_support == has_massive_support)

    return query.order_by(Product.product_name.asc()).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

@router.get("/{product_id}/data-availability", response_model=List[DataAvailabilityOut])
def get_product_data_availability(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return (
        db.query(ProductDataAvailability)
        .filter(ProductDataAvailability.product_id == product_id)
        .order_by(ProductDataAvailability.data_type.asc())
        .all()
    )


@router.get("/{product_id}/links", response_model=List[ProductLinkOut])
def get_product_links(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return (
        db.query(ProductLink)
        .filter(ProductLink.product_id == product_id)
        .order_by(ProductLink.link_type.asc())
        .all()
    )


@router.get("/{product_id}/continuous-series-rule", response_model=List[ContinuousSeriesRuleOut])
def get_product_continuous_series_rule(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return (
        db.query(ContinuousSeriesRule)
        .filter(ContinuousSeriesRule.product_id == product_id)
        .all()
    )


@router.get("/{product_id}/contract-status", response_model=ProductContractStatusOut | None)
def get_product_contract_status(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return (
        db.query(ProductContractStatus)
        .filter(ProductContractStatus.product_id == product_id)
        .first()
    )