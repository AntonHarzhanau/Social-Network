# Social Network

React/Vite client, Symfony API, PostgreSQL, MinIO and Mercure.

## Local development

Requires Docker Compose, PHP 8.5.12+ with `pdo_pgsql`, Composer, OpenSSL and Node 24.

```bash
make dev-setup
```

Docker starts only infrastructure: PostgreSQL, MinIO, Mercure and Mailpit.
`server/.env` contains local development defaults. Application code runs locally.
Start each application in its own terminal:

```bash
make back-dev   # http://127.0.0.1:8000
make front-dev  # http://localhost:5173
```

Vite forwards `/api` to local Symfony, Mercure subscriptions to port 3000 and
`/media` to MinIO on port 9000. Mailpit UI: http://localhost:8025.
Client proxy overrides are listed in `client/.env.example`.

```bash
make dev       # start infrastructure on subsequent runs
make dev-down  # stop infrastructure, keep data
make test      # PHPUnit with its own temporary PostgreSQL container
```

Infrastructure ports bind only to `127.0.0.1`. Development data belongs to the
separate Compose project `social-network-dev`.

## Test the release containers locally

```bash
make e2e
```

This builds five images, applies migrations and runs Playwright against the
built frontend. The stack uses test values from `.env.ci`, a random loopback port
and separate volumes in project `social-network-e2e`. It does not use dev data.
PHPUnit additionally runs through `make test`.

```bash
make e2e-down  # remove the disposable E2E stack and its test data
```

## Publish to GHCR

The workflow in `.github/workflows/ci.yml` runs PHPUnit and the frontend build
on pull requests and pushes to `main`. A version tag also builds the images,
starts the runtime stack, runs Playwright and publishes those exact images:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Publication uses `GITHUB_TOKEN` with `packages: write`. Images get both the
release tag and `sha-<commit>`. No image is rebuilt after Playwright. Build stages
are cached in GHCR under the separate `buildcache` tag, shared across releases.
Failed checks prevent publication of release images. Container logs
and Playwright reports are uploaded as CI artifacts.

Images are built for the Linux AMD64 runner:

```text
ghcr.io/antonharzhanau/social-network-frontend
ghcr.io/antonharzhanau/social-network-backend
ghcr.io/antonharzhanau/social-network-proxy
ghcr.io/antonharzhanau/social-network-storage
ghcr.io/antonharzhanau/social-network-storage-init
```

## Server

Copy only `compose.yaml` and a configured `.env` to the server. Start from
`.env.example`, replace the secrets, set `APP_VERSION` to a successful published
release, and configure the public URLs. Use a URL-safe PostgreSQL password.
For private GHCR packages, log in with a token that has `read:packages`.

```bash
docker compose pull
docker compose up -d --no-build --wait --wait-timeout 180
```

The server requires Docker Compose; it does not require the repository,
Node, Composer or Go. Images contain the application, dependencies, PHP settings
and storage initialization script. Startup creates JWT keys, applies migrations
and clears/warms the application cache. PostgreSQL, storage and JWT volumes
persist between deployments. The server does not create a development test DB.

Only the frontend publishes a host port (default 8080). For HTTPS, terminate TLS
at the frontend and set the public URLs accordingly.

| Service | Networks |
| --- | --- |
| frontend | frontend-net |
| backend-proxy | frontend-net, gateway-net |
| php | gateway-net, backend-net, egress |
| mercure, s3 | gateway-net, backend-net |
| postgres, s3-init, mailer | backend-net |

The two backend networks are internal. The proxy has no shared network with
PostgreSQL and receives no database credentials. Only PHP joins the egress
network for outgoing connections such as IONOS SMTP; it publishes no host ports.
The server example uses IONOS SMTP and disables the Mailpit profile. Set the SMTP
host to the one specified for your mailbox and URL-encode the mailbox password.
Dockhand secrets are explicitly interpolated into the PHP environment.

Umami is optional. Set `STATS_SCRIPT_URL`, `STATS_WEBSITE_ID` and optionally
`STATS_DOMAIN` in the frontend runtime environment. Nginx substitutes them into
`stats.js` when the container starts; no rebuild is required to change the values.
Tracking remains disabled without a valid HTTPS script URL and website ID.

`compose.build.yaml` adds build definitions for CI/manual builds;
`compose.e2e.yaml` adds only the test runner and test settings. Neither file is
needed on the server.

test
