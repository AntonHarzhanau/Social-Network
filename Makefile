DC := docker compose

.PHONY: setup up down destroy ps logs \
        front back s3-init \
        rebuild-nginx rebuild-php rebuild-postgres rebuild-s3 rebuild-mercure rebuild-mailer

setup:
	mkdir -p ./client/dist
	$(DC) --profile mailpit up -d --build --force-recreate --remove-orphans
	$(DC) --profile init run --rm s3-init

up:
	$(DC) up -d

down:
	$(DC) down --remove-orphans

destroy:
	$(DC) down -v --remove-orphans

ps:
	$(DC) ps

logs:
	$(DC) logs -f --tail=200

# Build SPA -> client/dist (nginx serves it)
front:
	$(DC) --profile tools run --rm client sh -lc "npm ci && npm run build"

# Rebuild ONLY symfony container image + recreate container
back:
	$(DC) build php
	$(DC) up -d --no-deps --force-recreate php

s3-init:
	$(DC) --profile init run --rm s3-init

rebuild-nginx:
	$(DC) up -d --no-deps --force-recreate nginx

rebuild-php:
	$(DC) build php
	$(DC) up -d --no-deps --force-recreate php

rebuild-postgres:
	$(DC) up -d --no-deps --force-recreate postgres

rebuild-s3:
	$(DC) up -d --no-deps --force-recreate s3

rebuild-mercure:
	$(DC) up -d --no-deps --force-recreate mercure

rebuild-mailer:
	$(DC) --profile mailpit up -d --no-deps --force-recreate mailer
