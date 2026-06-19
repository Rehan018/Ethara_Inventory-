from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Customer


class CustomerRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self) -> list[Customer]:
        statement = select(Customer).order_by(Customer.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get(self, customer_id: int) -> Customer | None:
        return self.db.get(Customer, customer_id)

    def get_by_email(self, email: str) -> Customer | None:
        return self.db.scalar(select(Customer).where(Customer.email == email.lower()))

    def create(self, customer: Customer) -> Customer:
        self.db.add(customer)
        self.db.flush()
        return customer

    def delete(self, customer: Customer) -> None:
        self.db.delete(customer)
        self.db.flush()
