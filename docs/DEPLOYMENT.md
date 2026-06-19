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

## 3. Deploy on Render with the Blueprint

The root `render.yaml` is ready for Render Blueprints. It creates:

- PostgreSQL database
- Backend API web service
- Frontend static site

In Render:

1. New → Blueprint
2. Select the GitHub repository
3. Use the root `render.yaml`
4. Apply the Blueprint

Render will ask for the values marked `sync: false`:

Environment variables:

```txt
BACKEND_CORS_ORIGINS=https://<your-render-frontend>.onrender.com
VITE_API_BASE_URL=https://<your-render-backend>.onrender.com
```

The backend receives `DATABASE_URL` from the Render PostgreSQL service automatically. The backend accepts Render's normal `postgresql://...` URL and converts it to the SQLAlchemy psycopg driver format internally, so no manual URL editing is needed.

After deploy:

- Open `https://<backend-url>/health`
- Open `https://<backend-url>/docs`
- Open `https://<frontend-url>`

## 4. Render scripts

Backend build command:

```bash
./scripts/render-build.sh
```

Backend pre-deploy command:

```bash
./scripts/render-migrate.sh
```

Backend start command:

```bash
./scripts/render-start.sh
```

Frontend build command:

```bash
./scripts/render-build.sh
```

If you create services manually in the Render dashboard, use these settings:

Backend:

- Runtime: Python
- Root directory: `backend`
- Build command: `./scripts/render-build.sh`
- Pre-deploy command: `./scripts/render-migrate.sh`
- Start command: `./scripts/render-start.sh`
- Health check path: `/health`

Frontend:

- Runtime: Static Site
- Root directory: `frontend`
- Build command: `./scripts/render-build.sh`
- Publish directory: `dist`
- Rewrite rule: `/*` → `/index.html`

## 5. Optional Vercel frontend

If you prefer Vercel for the frontend, create a new Vercel project from the same GitHub repo.

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
