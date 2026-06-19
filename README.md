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
- `compose.yaml` — service orchestration.
- `Makefile` — main development commands.

## Requirements

- Docker + Docker Compose.
- GNU Make.

## Quick start (recommended)

1. Go to the project root.
2. Make sure `server/.env` exists (the repository already includes a default one for local development).
3. Rename `client/.env.example` to `client/.env` and edit if needed (it’s already configured for local development by default).
4. Run:

```bash
make setup
```

This command:

- builds the frontend (`client/dist`),
- starts all containers,
- initializes the MinIO bucket,
- creates the database (if it doesn’t exist) and runs migrations.

After startup:

- App: `http://localhost:8080`
- API: `http://localhost:8080/api`
- Mercure: `http://localhost:8080/.well-known/mercure`
- Mailpit UI (profile `local`): `http://localhost:8025`

## Useful commands

```bash
make up         # start services
make down       # stop services
make destroy    # stop and remove volumes
make ps         # container status
make logs       # logs for all services

make front      # build frontend into client/dist
make front-dev  # run Vite dev server on :5173
make back       # rebuild and restart php
make s3-init    # re-initialize MinIO
```

## E2E tests

The Playwright tests live in `tests/` and can run in a dedicated Docker
container:

```bash
make e2e
```

This starts the API stack with Mailpit, then runs the Playwright service from
`compose.e2e.yaml`. The test container uses its own `node_modules` volume, so it
does not depend on host-side frontend dependencies.

To stop the e2e stack:

```bash
make e2e-down
```

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

For local development, the default `server/.env` is already configured. For production, use a separate env file and replace secrets/keys.

## Notes

- The root Nginx serves the built SPA from `client/dist` and proxies `/api` to Symfony.
