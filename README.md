# Social Network

A full-featured social network with a React web client and a Symfony-based API.

## What’s inside

- Post feed, comments, likes.
- User profiles and privacy settings.
- Friends, friend requests, blocks.
- Private and group chats.
- Groups and member management.
- Media upload and viewing (MinIO/S3), real-time updates via Mercure.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Query, Zustand.
- Backend: PHP, Symfony, Doctrine ORM, PostgreSQL, JWT.
- Infrastructure: Docker Compose, Nginx, MinIO, Mercure, Mailpit (for local development).

## Project structure

- `client/` — SPA client.
- `server/` — Symfony API and business logic.
- `docker/` — Dockerfiles and infrastructure configs.
- `tests/` — Playwright e2e tests.
- `compose.yaml` — local application stack.
- `compose.e2e.yaml` — Playwright e2e runner overlay.
- `Makefile` — main development commands.

## Requirements

- Docker + Docker Compose.
- GNU Make.

## Quick start (recommended)

1. Go to the project root.
2. Make sure `server/.env` exists (the repository already includes a default one for local development).
3. Run:

```bash
make setup
```

This command:

- builds the frontend (`client/dist`),
- starts all containers,
- initializes the MinIO bucket,
- creates the database (if it doesn’t exist) and runs migrations.
- generates JWT keys into a Docker volume if they do not exist yet.

After startup:

- App: `http://localhost:8080`
- API: `http://localhost:8080/api`
- Mercure: `http://localhost:8080/.well-known/mercure`
- Mailpit UI (profile `local`): `http://localhost:8025`

`client/.env` is optional for Docker usage. Copy `client/.env.example` only if
you want to override local Vite settings while running the frontend outside
Docker.

## Useful commands

```bash
make up         # start services
make down       # stop services
make destroy    # stop and remove volumes
make ps         # container status
make logs       # logs for all services

make front      # build frontend into client/dist
make back       # rebuild and restart php
make s3-init    # re-initialize MinIO
```

## E2E tests

Playwright tests live in `tests/` and are split by page/feature:

- `tests/auth-page.spec.ts`
- `tests/feed-posts.spec.ts`
- `tests/profile-post-menu.spec.ts`
- `tests/support/` for shared helpers.

Run them through Docker:

```bash
make e2e
```

This command starts the API stack with Mailpit, then runs the `playwright`
service from `compose.e2e.yaml`. The runner uses its own Docker volume for
`client/node_modules`, so it does not depend on host-side frontend
dependencies and does not create root-owned `node_modules` files in the
working tree.

After a successful run, the stack is left running so you can inspect the app,
Mailpit, logs, or generated data.

To stop the e2e stack:

```bash
make e2e-down
```

If you already have the app stack running and only want to ensure e2e
dependencies are available:

```bash
make e2e-up
```

For local debugging without Docker Playwright, install client dependencies and
run:

```bash
npm --prefix client ci
npm --prefix client exec playwright -- install chromium
npm --prefix client run test:e2e
```

The Docker path (`make e2e`) is the preferred one for consistent results.

## Working with the backend inside the container

```bash
docker compose --env-file server/.env exec php php bin/console doctrine:migrations:migrate
docker compose --env-file server/.env exec php php bin/console cache:clear
docker compose --env-file server/.env exec php php bin/phpunit
```

## Environment variables

Main parameters are located in `server/.env`:

- DB: `POSTGRES_*`, `DATABASE_URL`
- JWT: `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY`, `JWT_PASSPHRASE`
- S3/MinIO: `MINIO_*`, `AWS_*`
- HTTP bind/port: `NGINX_BIND_IP`, `HTTP_PORT`

For local development, the default `server/.env` is already configured. JWT key
files are generated automatically into the `jwt_keys` Docker volume. For
production, use a separate env file and replace secrets/keys.

## Notes

- The root Nginx serves the built SPA from `client/dist` and proxies `/api` to Symfony.
- Docker volumes are used for Symfony `vendor/`, Symfony `var/`, JWT keys,
  Composer cache, frontend `node_modules`, Postgres data, MinIO data, and e2e
  Playwright dependencies.
- If Docker fails with `docker-credential-desktop.exe: exec format error`, your
  `~/.docker/config.json` likely points to Docker Desktop's Windows credential
  helper. Remove `"credsStore": "desktop.exe"`/`"credStore": "desktop.exe"`
  from that file, keeping valid JSON, then retry.
