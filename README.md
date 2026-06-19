# Ethara Inventory & Order Management

Built by Rehan for the Software Engineer technical assessment.

This is a full-stack inventory and order management system for small business operations. The app handles products, customers, orders, stock deduction, low-stock reporting, and an inventory movement log so stock changes are traceable.

I kept the stack close to the kind of backend work I usually want to show: FastAPI, PostgreSQL, SQLAlchemy, Alembic, Docker, and a typed React frontend.

## Stack

Backend:

- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- Pydantic v2
- JWT authentication
- Docker

Frontend:

- React + Vite
- TypeScript
- Material UI
- TanStack Query
- Axios
- React Router

Deployment:

- Backend: Render
- Database: Render PostgreSQL
- Frontend: Vercel

## What is included

- JWT register/login
- Product CRUD
- Customer create/list/detail/delete
- Order create/list/detail/cancel
- Stock deduction when an order is created
- Stock restoration when an order is cancelled
- Backend-calculated order totals
- Unique SKU and customer email constraints
- Low-stock dashboard
- Inventory transaction table for stock audit history
- Swagger docs at `/docs`
- Dockerfiles for backend and frontend
- Docker Compose with PostgreSQL named volume

## Project structure

```txt
backend/
  app/
    api/             FastAPI routes and dependencies
    core/            config, security, exception handling
    db/              SQLAlchemy session and base model
    models/          database tables
    repositories/    database access helpers
    schemas/         Pydantic request/response models
    services/        business logic
  alembic/           database migrations

frontend/
  src/
    api/             Axios API calls
    components/      shared UI pieces
    context/         auth session state
    hooks/           small reusable hooks
    layouts/         app shell
    pages/           screen-level components
    routes/          protected route wrapper
    types/           TypeScript API types
```

## Run locally with Docker

Create the local environment file:

```bash
cp .env.example .env
```

Update the password and JWT secret in `.env`, then start everything:

```bash
docker compose up --build
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`

The backend container runs Alembic migrations on startup. PostgreSQL data is stored in the `postgres_data` Docker volume.

## Run without Docker

Backend:

Start a local PostgreSQL container for the backend. I use host port `5433` here so it does not fight with any PostgreSQL already installed on the machine.

```bash
docker run --name ethara-local-postgres \
  -e POSTGRES_DB=inventory_db \
  -e POSTGRES_USER=inventory \
  -e POSTGRES_PASSWORD=inventory_pass \
  -p 5433:5432 \
  -d postgres:16-alpine
```

Then start the API:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

If that database container already exists, start it again with:

```bash
docker start ethara-local-postgres
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API overview

Auth:

- `POST /auth/register`
- `POST /auth/login`

Products:

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

Customers:

- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

Orders:

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

Dashboard:

- `GET /dashboard`

`DELETE /orders/{id}` cancels the order instead of hard-deleting it. That keeps the order history intact and restores the product stock.

## Deployment notes

Render:

- Create a Render PostgreSQL database.
- Deploy the backend as a Docker web service from the `backend` directory.
- Set `DATABASE_URL`, `JWT_SECRET_KEY`, and `BACKEND_CORS_ORIGINS`.
- After the backend is live, check `/health` and `/docs`.

Vercel:

- Import the repo.
- Set the frontend root directory to `frontend`.
- Add `VITE_API_BASE_URL` with the Render backend URL.
- Deploy.

The `render.yaml` and `frontend/vercel.json` files are included so the deployment setup is repeatable.

## Submission placeholders

- GitHub repository:
- Docker Hub backend image:
- Live frontend URL:
- Live backend API URL:

## A few decisions I made

- Orders are cancelled, not physically deleted. Inventory and order systems usually need history.
- Stock changes are written into `inventory_transactions`, so product quantity changes are auditable.
- The backend calculates totals. The frontend only shows an estimated total while the user is creating an order.
- Product rows use a low-stock threshold instead of one fixed global number.
