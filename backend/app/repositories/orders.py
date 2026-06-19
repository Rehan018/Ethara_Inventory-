from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models import Order, OrderItem


class OrderRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self) -> list[Order]:
        statement = (
            select(Order)
            .options(joinedload(Order.customer), selectinload(Order.items))
            .order_by(Order.created_at.desc())
        )
        return list(self.db.scalars(statement).unique().all())

    def get(self, order_id: int) -> Order | None:
        statement = (
            select(Order)
            .where(Order.id == order_id)
            .options(joinedload(Order.customer), selectinload(Order.items).joinedload(OrderItem.product))
        )
        return self.db.scalars(statement).unique().one_or_none()
