from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.schemas.order import OrderCreate, OrderRead
from app.services.orders import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"], dependencies=[Depends(get_current_user)])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> OrderRead:
    return OrderService(db).create_order(payload)


@router.get("", response_model=list[OrderRead])
def list_orders(db: Session = Depends(get_db)) -> list[OrderRead]:
    return OrderService(db).list_orders()


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)) -> OrderRead:
    return OrderService(db).get_order(order_id)


@router.delete("/{order_id}", response_model=OrderRead)
def cancel_order(order_id: int, db: Session = Depends(get_db)) -> OrderRead:
    return OrderService(db).cancel_order(order_id)
