DC := docker compose -f compose.yaml
PHP := $(DC) exec -T php

# Для команд, где нужен client (профиль dev включаем только точечно)
DC_DEV := COMPOSE_PROFILES=dev $(DC)
NPM := $(DC_DEV) run --rm client

.PHONY: up down destroy ps logs bash \
        composer-install jwt db-migrate s3-init \
        front-install front-build front \
        prod dev setup rebuild

up:
	$(DC) up -d --build

down:
	$(DC) down --remove-orphans

destroy:
	$(DC) down -v --remove-orphans

ps:
	$(DC) ps

logs:
	$(DC) logs -f --tail=200

bash:
	$(DC) exec php bash

# -------------------------
# Server
# -------------------------
composer-install:
	$(PHP) sh -lc 'if [ "$$APP_ENV" = "prod" ]; then composer install --no-dev --optimize-autoloader; else composer install; fi'

db-migrate:
	$(PHP) sh -lc 'php bin/console doctrine:database:create --if-not-exists --no-interaction || true'
	$(PHP) sh -lc 'php bin/console doctrine:migrations:migrate --no-interaction'

jwt:
	$(PHP) sh -lc '\
	  php -r '\'' \
	    $$p="config/jwt/private.pem"; \
	    if (!file_exists($$p)) exit(1); \
	    $$k="file://".getcwd()."/".$$p; \
	    $$pass=getenv("JWT_PASSPHRASE") ?: ""; \
	    $$ok=@openssl_pkey_get_private($$k, $$pass) ?: @openssl_pkey_get_private($$k); \
	    exit($$ok?0:1); \
	  '\'' \
	  && echo "JWT key OK" \
	  || (echo "Regenerating JWT keypair..." && rm -f config/jwt/private.pem config/jwt/public.pem && php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction);'

s3-init:
	$(DC) run --rm s3-init

# -------------------------
# Frontend
# -------------------------
front-install:
	$(NPM) npm ci

front-build:
	$(NPM) npm run build

# make front = только пересборка, без переустановки
front: front-build

# -------------------------
# Modes
# -------------------------
prod:
	NGINX_MODE=prod $(DC) up -d --force-recreate nginx
	-$(DC_DEV) stop client >/dev/null 2>&1 || true

dev:
	NGINX_MODE=dev $(DC) up -d --build
	$(MAKE) front-install
	NGINX_MODE=dev $(DC_DEV) up -d --build client
	NGINX_MODE=dev $(DC) up -d --force-recreate nginx

# make setup = полностью рабочий проект после одной команды
setup: front-install front-build up composer-install jwt db-migrate s3-init prod

# на проде после смены APP_ENV=prod: make rebuild
rebuild:
	$(DC) up -d --build --force-recreate
