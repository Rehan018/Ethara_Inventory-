from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models import InventoryTransaction, Product
from app.repositories.products import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.products = ProductRepository(db)

    def list_products(self) -> list[Product]:
        return self.products.list()

    def get_product(self, product_id: int) -> Product:
        product = self.products.get(product_id)
        if not product:
            raise NotFoundError("Product not found")
        return product

    def create_product(self, payload: ProductCreate) -> Product:
        product = Product(**payload.model_dump())
        self.products.create(product)

        self.db.add(
            InventoryTransaction(
                product=product,
                change_type="PRODUCT_ADDED",
                quantity_change=product.quantity_in_stock,
                stock_after=product.quantity_in_stock,
            )
        )

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError("Product SKU already exists") from exc

        self.db.refresh(product)
        return product

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        previous_stock = product.quantity_in_stock

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(product, field, value)

        if product.quantity_in_stock != previous_stock:
            self.db.add(
                InventoryTransaction(
                    product=product,
                    change_type="PRODUCT_UPDATED",
                    quantity_change=product.quantity_in_stock - previous_stock,
                    stock_after=product.quantity_in_stock,
                )
            )

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError("Product SKU already exists") from exc

        self.db.refresh(product)
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        self.products.delete(product)
        self.db.commit()
