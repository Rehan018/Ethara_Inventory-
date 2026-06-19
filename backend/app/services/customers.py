from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models import Customer
from app.repositories.customers import CustomerRepository
from app.schemas.customer import CustomerCreate


class CustomerService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.customers = CustomerRepository(db)

    def list_customers(self) -> list[Customer]:
        return self.customers.list()

    def get_customer(self, customer_id: int) -> Customer:
        customer = self.customers.get(customer_id)
        if not customer:
            raise NotFoundError("Customer not found")
        return customer

    def create_customer(self, payload: CustomerCreate) -> Customer:
        customer = Customer(
            full_name=payload.full_name.strip(),
            email=payload.email.lower(),
            phone=payload.phone.strip(),
        )
        self.customers.create(customer)

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError("Customer email already exists") from exc

        self.db.refresh(customer)
        return customer

    def delete_customer(self, customer_id: int) -> None:
        customer = self.get_customer(customer_id)
        self.customers.delete(customer)
        self.db.commit()
