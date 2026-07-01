# Easypanel deployment — GCSR State Data Lakehouse

| Item | Value |
|------|-------|
| Panel | [http://31.97.207.166:3000/projects/gujrat-state-datalake](http://31.97.207.166:3000/projects/gujrat-state-datalake) |
| Public URL | **https://gsrc.demo.agrayianailabs.com** |
| Live URL (works without DNS) | **https://gujrat-state-datalake-stack.fhkvgj.easypanel.host** |
| GitHub | https://github.com/OHA2025g/gujrat-state-datalake |
| Compose file | `docker-compose.yml` |

---

## 0. DNS (required for custom domain)

The app is already deployed. `DNS_PROBE_FINISHED_NXDOMAIN` means the **DNS A record is missing** — not a server failure.

In the **Hostinger DNS zone** for `agrayianailabs.com` (nameservers: `ns1.dns-parking.com`), add:

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| A | `gsrc.demo` | `31.97.207.166` | 300 |

Same pattern as the working record for `ecourt.demo.agrayianailabs.com`.

Verify:

```bash
dig +short gsrc.demo.agrayianailabs.com
# must return 31.97.207.166
```

---

## 1. Compose service source

| Setting | Value |
|---------|-------|
| Repository | `https://github.com/OHA2025g/gujrat-state-datalake` |
| Branch | `main` |
| Root path | `/` |
| Compose file | `docker-compose.yml` |

---

## 2. Environment

Enable **Create .env file** and paste from [`compose.env.example`](./compose.env.example).

Set a strong `JWT_SECRET_KEY` and optional `MISTRAL_API_KEY` for AI Copilot.

---

## 3. Domain

| Setting | Value |
|---------|-------|
| Service | `frontend` (inside compose stack) |
| Host | `gsrc.demo.agrayianailabs.com` |
| Port | `80` |
| HTTPS | Enabled |

The frontend nginx proxies `/api/*` to the backend — single domain is enough.

---

## 4. Deploy

Click **Deploy** and wait 5–10 minutes for the first build.

### Verify

```bash
curl -I https://gsrc.demo.agrayianailabs.com/
curl -X POST https://gsrc.demo.agrayianailabs.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"state_admin","password":"Admin@123"}'
```

---

## 5. Demo login

| Role | Username | Password |
|------|----------|----------|
| State Admin | `state_admin` | `Admin@123` |
| Department Officer | `dept_officer` | `Health@123` |
| District Officer | `district_officer` | `District@123` |
| Citizen | `citizen` | `Citizen@123` |

---

## Automated deploy script

If you have Easypanel login credentials:

```bash
EASYPANEL_EMAIL='you@example.com' \
EASYPANEL_PASSWORD='your-password' \
node deploy/easypanel/deploy.mjs
```

This logs in, ensures the compose service exists, adds the domain, and triggers deploy.
