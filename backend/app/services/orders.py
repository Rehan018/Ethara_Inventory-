from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.exceptions import BadRequestError, NotFoundError
from app.models import Customer, InventoryTransaction, Order, OrderItem, Product
from app.schemas.order import OrderCreate


class OrderService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_orders(self) -> list[Order]:
        statement = (
            select(Order)
            .options(joinedload(Order.customer), selectinload(Order.items).selectinload(OrderItem.product))
            .order_by(Order.created_at.desc())
        )
        return list(self.db.scalars(statement).unique().all())

    def get_order(self, order_id: int) -> Order:
        statement = (
            select(Order)
            .where(Order.id == order_id)
            .options(joinedload(Order.customer), selectinload(Order.items).selectinload(OrderItem.product))
        )
        order = self.db.scalars(statement).unique().one_or_none()
        if not order:
            raise NotFoundError("Order not found")
        return order

    def create_order(self, payload: OrderCreate) -> Order:
        customer = self.db.get(Customer, payload.customer_id)
        if not customer:
            raise NotFoundError("Customer not found")

        product_ids = {item.product_id for item in payload.items}
        if len(product_ids) != len(payload.items):
            raise BadRequestError("Duplicate products are not allowed in the same order")

        products = self._load_products_for_update(product_ids)
        missing_products = product_ids - set(products.keys())
        if missing_products:
            raise NotFoundError(f"Product not found: {sorted(missing_products)[0]}")

        order = Order(customer_id=customer.id, status="CREATED", total_amount=Decimal("0.00"))
        self.db.add(order)
        self.db.flush()

        total = Decimal("0.00")

        for item in payload.items:
            product = products[item.product_id]
            if product.quantity_in_stock < item.quantity:
                raise BadRequestError(f"Insufficient stock for {product.name}")

            line_total = product.price * item.quantity
            total += line_total

            product.quantity_in_stock -= item.quantity

            self.db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.price,
                    line_total=line_total,
                )
            )
            self.db.add(
                InventoryTransaction(
                    product_id=product.id,
                    change_type="ORDER_CREATED",
                    quantity_change=-item.quantity,
                    stock_after=product.quantity_in_stock,
                    reference_order_id=order.id,
                )
            )

        order.total_amount = total
        self.db.commit()
        return self.get_order(order.id)

    def cancel_order(self, order_id: int) -> Order:
        order = self.get_order(order_id)
        if order.status == "CANCELLED":
            raise BadRequestError("Order is already cancelled")

        for item in order.items:
            item.product.quantity_in_stock += item.quantity
            self.db.add(
                InventoryTransaction(
                    product_id=item.product_id,
                    change_type="ORDER_CANCELLED",
                    quantity_change=item.quantity,
                    stock_after=item.product.quantity_in_stock,
                    reference_order_id=order.id,
                )
            )

        order.status = "CANCELLED"
        self.db.commit()
        return self.get_order(order.id)

    def _load_products_for_update(self, product_ids: set[int]) -> dict[int, Product]:
        statement = select(Product).where(Product.id.in_(product_ids)).with_for_update()
        products = self.db.scalars(statement).all()
        return {product.id: product for product in products}
