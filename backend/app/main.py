from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_auth, routes_customers, routes_dashboard, routes_orders, routes_products
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.backend_cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(routes_auth.router)
app.include_router(routes_products.router)
app.include_router(routes_customers.router)
app.include_router(routes_orders.router)
app.include_router(routes_dashboard.router)


@app.get("/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
