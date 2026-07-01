# GCSR State Data Lakehouse

Gujarat Common Social Registry — State Data Lakehouse proof of concept.

- **Frontend:** React (120 screens across 15 modules)
- **Backend:** FastAPI + MongoDB
- **AI:** Mistral-powered copilot (optional)

## Quick start (Docker)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Add MISTRAL_API_KEY to backend/.env if using AI Copilot
docker compose up --build -d
```

Open **http://localhost:5185** (add `ports: ["5185:80"]` under `frontend` in `docker-compose.yml` for local access).

**Demo login:** `state_admin` / `Admin@123`

## Deploy on Easypanel

See [EASYPANEL.md](./EASYPANEL.md) for full instructions.

Panel: http://31.97.207.166:3000/projects/gujrat-state-datalake

## Repository

https://github.com/OHA2025g/gujrat-state-datalake
