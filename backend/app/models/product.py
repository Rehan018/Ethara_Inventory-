from decimal import Decimal

from sqlalchemy import CheckConstraint, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, IdMixin, TimestampMixin


class Product(IdMixin, TimestampMixin, Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("quantity_in_stock >= 0", name="ck_products_quantity_non_negative"),
        CheckConstraint("price >= 0", name="ck_products_price_non_negative"),
    )

    name: Mapped[str] = mapped_column(String(160), nullable=False)
    sku: Mapped[str] = mapped_column(String(80), nullable=False, unique=True, index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    quantity_in_stock: Mapped[int] = mapped_column(nullable=False, default=0)
    low_stock_threshold: Mapped[int] = mapped_column(nullable=False, default=5)

    order_items = relationship("OrderItem", back_populates="product")
    inventory_transactions = relationship(
        "InventoryTransaction",
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
