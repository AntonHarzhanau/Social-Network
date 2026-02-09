ENV ?= local
ENV_FILE ?= ./server/.env

DC := ENV_FILE=$(ENV_FILE) docker compose --env-file $(ENV_FILE)

ifeq ($(ENV),local)
PROFILES := --profile mailpit
else
PROFILES :=
endif

.PHONY: setup up down destroy ps logs \
        front front-dev back s3-init \
        rebuild-nginx rebuild-php rebuild-postgres rebuild-s3 rebuild-mercure rebuild-mailer

setup:
	mkdir -p ./client/dist
	$(MAKE) front
	$(DC) $(PROFILES) up -d --build --force-recreate --remove-orphans

up:
	$(DC) $(PROFILES) up -d

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

# Manually rerun s3 init (normally it runs on up)
s3-init:
	$(DC) run --rm s3-init

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
ifeq ($(ENV),local)
	$(DC) --profile mailpit up -d --no-deps --force-recreate mailer
else
	@echo "mailer (mailpit) disabled for ENV=$(ENV)"
endif
