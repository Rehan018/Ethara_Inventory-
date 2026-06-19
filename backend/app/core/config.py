from functools import lru_cache
import json
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Ethara Inventory API"
    environment: str = "local"
    api_prefix: str = ""

    database_url: str = "postgresql+psycopg://inventory:inventory_pass@localhost:5433/inventory_db"

    jwt_secret_key: str = "change-this-before-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    backend_cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    backend_cors_origin_regex: str = r"https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @field_validator("database_url", mode="before")
    @classmethod
    def use_psycopg_driver(cls, value: Any) -> Any:
        if isinstance(value, str) and value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if isinstance(value, str) and value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    @property
    def cors_origins(self) -> list[str]:
        value = self.backend_cors_origins.strip()
        if not value:
            return []
        if value.startswith("["):
            parsed = json.loads(value)
            return [str(origin).strip() for origin in parsed if str(origin).strip()]
        return [origin.strip() for origin in value.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
