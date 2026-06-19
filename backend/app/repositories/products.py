from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Product


class ProductRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self) -> list[Product]:
        statement = select(Product).order_by(Product.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)

    def get_by_sku(self, sku: str) -> Product | None:
        return self.db.scalar(select(Product).where(Product.sku == sku))

    def create(self, product: Product) -> Product:
        self.db.add(product)
        self.db.flush()
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.flush()
