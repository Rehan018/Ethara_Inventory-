# Deployment Notes

These are the exact deployment steps I would follow for the assessment submission.

## 1. Push the code to GitHub

```bash
git init
git add .
git commit -m "Build inventory and order management system"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

## 2. Push the backend image to Docker Hub

```bash
cd backend
docker build -t <dockerhub-username>/ethara-inventory-api:latest .
docker push <dockerhub-username>/ethara-inventory-api:latest
```

Use this image link in the final submission:

```txt
https://hub.docker.com/r/<dockerhub-username>/ethara-inventory-api
```

## 3. Create Render PostgreSQL

Create a new PostgreSQL database on Render and keep the internal database URL handy.

The backend accepts Render's normal `postgresql://...` URL and converts it to the SQLAlchemy psycopg driver format internally, so no manual URL editing is needed.

## 4. Deploy backend on Render

Create a new Render Web Service:

- Runtime: Docker
- Root directory: `backend`
- Health check path: `/health`

Environment variables:

```txt
DATABASE_URL=<Render PostgreSQL internal database URL>
JWT_SECRET_KEY=<long random secret>
ACCESS_TOKEN_EXPIRE_MINUTES=60
BACKEND_CORS_ORIGINS=https://<your-vercel-app>.vercel.app
```

After deploy:

- Open `https://<backend-url>/health`
- Open `https://<backend-url>/docs`

## 5. Deploy frontend on Vercel

Create a new Vercel project from the same GitHub repo.

Settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Environment variable:

```txt
VITE_API_BASE_URL=https://<backend-url>
```

Redeploy after setting the env variable.

## 6. Final check

Before submitting, test this flow on the live app:

1. Register a user.
2. Add one customer.
3. Add two products.
4. Create an order.
5. Confirm product stock is reduced.
6. Cancel the order.
7. Confirm product stock is restored.
8. Open backend `/docs`.

## Submission

```txt
GitHub repository:
Docker Hub backend image:
Live frontend URL:
Live backend API URL:
```
