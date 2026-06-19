from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, IdMixin, TimestampMixin


class InventoryTransaction(IdMixin, TimestampMixin, Base):
    __tablename__ = "inventory_transactions"

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    change_type: Mapped[str] = mapped_column(String(40), nullable=False)
    quantity_change: Mapped[int] = mapped_column(nullable=False)
    stock_after: Mapped[int] = mapped_column(nullable=False)
    reference_order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id", ondelete="SET NULL"), nullable=True)

    product = relationship("Product", back_populates="inventory_transactions")
