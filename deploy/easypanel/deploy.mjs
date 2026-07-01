#!/usr/bin/env node
/**
 * Deploy GCSR to Easypanel via tRPC API.
 * Usage:
 *   EASYPANEL_EMAIL=... EASYPANEL_PASSWORD=... node deploy/easypanel/deploy.mjs
 */
import http from 'node:http';

const PANEL = process.env.EASYPANEL_URL || 'http://31.97.207.166:3000';
const EMAIL = process.env.EASYPANEL_EMAIL;
const PASSWORD = process.env.EASYPANEL_PASSWORD;
const PROJECT = process.env.EASYPANEL_PROJECT || 'gujrat-state-datalake';
const SERVICE = process.env.EASYPANEL_SERVICE || 'app';
const DOMAIN = process.env.PUBLIC_DOMAIN || 'gsrc.demo.agrayianailabs.com';
const GITHUB = 'https://github.com/OHA2025g/gujrat-state-datalake';

if (!EMAIL || !PASSWORD) {
  console.error('Set EASYPANEL_EMAIL and EASYPANEL_PASSWORD');
  process.exit(1);
}

let token = null;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, PANEL);
    const payload = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            const msg = json.error?.json?.message || json.error?.message || JSON.stringify(json.error);
            reject(new Error(msg));
          } else if (json.result?.data?.json !== undefined) {
            resolve(json.result.data.json);
          } else if (json.json !== undefined) {
            resolve(json.json);
          } else {
            resolve(json);
          }
        } catch {
          reject(new Error(`Bad response (${res.statusCode}): ${data.slice(0, 400)}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function mutate(proc, input) {
  return request('POST', `/api/trpc/${proc}`, { json: input });
}

async function query(proc, input) {
  const qs = input ? `?input=${encodeURIComponent(JSON.stringify({ json: input }))}` : '';
  return request('GET', `/api/trpc/${proc}${qs}`);
}

async function tryMutate(proc, input) {
  try {
    return await mutate(proc, input);
  } catch (e) {
    console.warn(`  skip ${proc}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('Logging in to Easypanel...');
  const login = await mutate('auth.login', { email: EMAIL, password: PASSWORD });
  token = login.token;
  if (!token) throw new Error('Login failed — no token returned');
  console.log('Logged in.');

  console.log('Listing projects...');
  const projects = await query('projects.listProjectsAndServices');
  const project = (projects?.projects || projects || []).find?.(
    (p) => p.name === PROJECT || p.projectName === PROJECT,
  ) || projects;
  console.log('Project snapshot:', JSON.stringify(project, null, 2).slice(0, 800));

  const hasCompose = JSON.stringify(projects).includes(SERVICE);
  if (!hasCompose) {
    console.log(`Creating compose service "${SERVICE}"...`);
    await mutate('services.compose.createService', { projectName: PROJECT, serviceName: SERVICE });
  }

  // Best-effort compose configuration (procedure names vary by Easypanel version)
  console.log('Configuring GitHub source...');
  await tryMutate('services.compose.updateSourceGithub', {
    projectName: PROJECT,
    serviceName: SERVICE,
    owner: 'OHA2025g',
    repo: 'gujrat-state-datalake',
    branch: 'main',
    path: '/',
    composeFile: 'docker-compose.yml',
  });
  await tryMutate('services.compose.updateSourceGithub', {
    projectName: PROJECT,
    serviceName: SERVICE,
    githubUrl: GITHUB,
    branch: 'main',
    composePath: 'docker-compose.yml',
  });

  const env = `DB_NAME=test_database
CORS_ORIGINS=https://${DOMAIN}
JWT_SECRET_KEY=gcsr-easypanel-jwt-${Date.now()}
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=480
MISTRAL_MODEL=mistral-large-latest
BACKEND_HOST=backend`;

  console.log('Setting environment...');
  await tryMutate('services.compose.updateEnv', { projectName: PROJECT, serviceName: SERVICE, env });
  await tryMutate('services.compose.updateEnvironment', { projectName: PROJECT, serviceName: SERVICE, env, createDotEnv: true });

  console.log(`Adding domain ${DOMAIN}...`);
  await tryMutate('domains.createDomain', {
    projectName: PROJECT,
    serviceName: SERVICE,
    host: DOMAIN,
    https: true,
    port: 80,
  });

  console.log('Deploying compose stack...');
  const deploy = await mutate('services.compose.deployService', {
    projectName: PROJECT,
    serviceName: SERVICE,
  });
  console.log('Deploy triggered:', JSON.stringify(deploy, null, 2));

  console.log(`\nDone. Once DNS resolves and build completes, open:\n  https://${DOMAIN}\n`);
}

main().catch((e) => {
  console.error('Deploy failed:', e.message);
  process.exit(1);
});
