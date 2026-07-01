# Deploy GCSR State Lakehouse on Easypanel

Panel: [http://31.97.207.166:3000/projects/gujrat-state-datalake](http://31.97.207.166:3000/projects/gujrat-state-datalake)

GitHub repo: [https://github.com/OHA2025g/gujrat-state-datalake](https://github.com/OHA2025g/gujrat-state-datalake)

## 1. Create / configure Compose service

1. Open the project in Easypanel.
2. Add or edit a **Compose** service.
3. **Source** settings:
   - Repository: `https://github.com/OHA2025g/gujrat-state-datalake`
   - Branch: `main`
   - Root path: `/`
   - Compose file: `docker-compose.yml`

## 2. Environment variables

Open **Environment**, enable **Create .env file**, and paste:

```env
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET_KEY=your-long-random-secret-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=480
MISTRAL_API_KEY=your-mistral-key-if-using-ai-copilot
MISTRAL_MODEL=mistral-large-latest
```

Save the environment before deploying.

## 3. Deploy

Click **Deploy** and wait for all three services to build:

- `mongo` — database
- `backend` — FastAPI API on port 8000 (internal)
- `frontend` — React app served by nginx on port 80 (internal)

First deploy may take 5–10 minutes (frontend yarn build + backend pip install).

## 4. Domain mapping

1. Go to **Domains** for the compose stack.
2. Add a domain (or use the generated Easypanel domain).
3. Map the domain to the **`frontend`** service.
4. Set **port** to `80`.
5. Enable HTTPS if desired (Easypanel handles Let's Encrypt).

The frontend nginx proxy forwards `/api/*` to the backend automatically — no separate backend domain is required.

## 5. Verify

- Open your domain in a browser.
- Login with demo account: `state_admin` / `Admin@123`
- API health: `https://your-domain/api/` should respond (via nginx proxy)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on frontend | Ensure server has ≥ 2 GB RAM; redeploy |
| Backend crash on start | Check Mongo is healthy; verify env vars are set |
| 502 / Service not reachable | Wait for healthchecks; map domain to **frontend** port **80** |
| AI Copilot empty replies | Set `MISTRAL_API_KEY` in Environment and redeploy |

## Local Docker (same stack)

```bash
cp .env.example .env
# edit .env with your secrets
docker compose up --build -d
```

App runs at http://localhost:5185 when using local port mapping (optional for local dev only).
