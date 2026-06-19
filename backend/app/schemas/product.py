from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    sku: str = Field(min_length=2, max_length=80)
    price: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    quantity_in_stock: int = Field(ge=0)
    low_stock_threshold: int = Field(default=5, ge=0)

    @field_validator("sku")
    @classmethod
    def normalize_sku(cls, value: str) -> str:
        return value.strip().upper()


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=160)
    sku: str | None = Field(default=None, min_length=2, max_length=80)
    price: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2)
    quantity_in_stock: int | None = Field(default=None, ge=0)
    low_stock_threshold: int | None = Field(default=None, ge=0)

    @field_validator("sku")
    @classmethod
    def normalize_sku(cls, value: str | None) -> str | None:
        return value.strip().upper() if value else value


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
