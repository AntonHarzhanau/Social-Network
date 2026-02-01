DC := docker compose
PHP := $(DC) exec -T php

SERVER_DIR := $(abspath $(CURDIR))
CLIENT_DIR := $(abspath $(SERVER_DIR)/../client)
PUBLIC_DIR := $(SERVER_DIR)/public

.PHONY: up build down stop start destroy ps logs bash x \
        composer-install cache-clear db-migrate jwt s3-init \
        front-install front-build front-deploy front setup

up:
	@mkdir -p var/log/nginx-log
	$(DC) up -d --build

build:
	$(DC) build

down:
	$(DC) down --remove-orphans

stop:
	$(DC) stop

start:
	$(DC) start

destroy:
	$(DC) down -v --remove-orphans

ps:
	$(DC) ps

logs:
	$(DC) logs -f --tail=200

bash:
	$(DC) exec php bash

x: bash

composer-install:
	$(PHP) composer install

cache-clear:
	$(PHP) php bin/console cache:clear

db-migrate:
	$(PHP) php bin/console doctrine:migrations:migrate --no-interaction

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


# Frontend

front-install:
	cd $(CLIENT_DIR) && npm ci

front-build:
	cd $(CLIENT_DIR) && npm run build

front: front-install front-build

setup: up composer-install jwt db-migrate s3-init front
