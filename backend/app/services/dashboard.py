from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Customer, Order, Product
from app.schemas.dashboard import DashboardSummary


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_summary(self) -> DashboardSummary:
        total_products = self.db.scalar(select(func.count(Product.id))) or 0
        total_customers = self.db.scalar(select(func.count(Customer.id))) or 0
        total_orders = self.db.scalar(select(func.count(Order.id)).where(Order.status != "CANCELLED")) or 0

        low_stock_statement = (
            select(Product)
            .where(Product.quantity_in_stock <= Product.low_stock_threshold)
            .order_by(Product.quantity_in_stock.asc(), Product.name.asc())
        )
        low_stock_items = list(self.db.scalars(low_stock_statement.limit(8)).all())
        low_stock_products = self.db.scalar(
            select(func.count(Product.id)).where(Product.quantity_in_stock <= Product.low_stock_threshold)
        ) or 0

        recent_orders = self.db.scalar(select(func.count(Order.id)).where(Order.status == "CREATED")) or 0

        return DashboardSummary(
            total_products=total_products,
            total_customers=total_customers,
            total_orders=total_orders,
            low_stock_products=low_stock_products,
            recent_orders=recent_orders,
            low_stock_items=low_stock_items,
        )
