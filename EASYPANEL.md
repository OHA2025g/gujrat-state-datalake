# Deploy GCSR State Data Lakehouse on Easypanel

**Panel:** [http://31.97.207.166:3000/projects/gujrat-state-datalake](http://31.97.207.166:3000/projects/gujrat-state-datalake)

**Public URL:** https://gsrc.demo.agrayianailabs.com

**Live now (no custom DNS needed):** https://gujrat-state-datalake-stack.fhkvgj.easypanel.host

**GitHub:** https://github.com/OHA2025g/gujrat-state-datalake

See [deploy/easypanel/README.md](./deploy/easypanel/README.md) for the full checklist.

## Quick steps

1. **DNS (required for custom domain):** In your `agrayianailabs.com` DNS panel (Hostinger), add an **A record** — same as `ecourt.demo.agrayianailabs.com`:
   - Host: `gsrc.demo`
   - Points to: `31.97.207.166`
   - TTL: 300 (or default)
2. **Compose source:** GitHub repo above, branch `main`, file `docker-compose.yml`
3. **Environment:** paste from `deploy/easypanel/compose.env.example`
4. **Domain:** service `frontend`, port `80`, HTTPS on
5. **Deploy** and wait ~5–10 min

## Automated deploy

```bash
EASYPANEL_EMAIL='your@email.com' \
EASYPANEL_PASSWORD='your-password' \
node deploy/easypanel/deploy.mjs
```
