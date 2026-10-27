ENV_FILE ?= .env
DEV_ENV_FILE ?= server/.env
TEST_IMAGE_PREFIX ?= social-network-test
TEST_IMAGE_TAG ?= local

DC = ENV_FILE=$(ENV_FILE) docker compose --env-file $(ENV_FILE) -f compose.yaml
BUILD_DC = $(DC) -f compose.build.yaml
DEV_DC = docker compose -p social-network-dev --env-file $(DEV_ENV_FILE) -f compose.dev.yaml
E2E_DC = ENV_FILE=.env.ci IMAGE_PREFIX=$(TEST_IMAGE_PREFIX) APP_VERSION=$(TEST_IMAGE_TAG) docker compose -p social-network-e2e --env-file .env.ci -f compose.yaml -f compose.e2e.yaml
E2E_BUILD_DC = ENV_FILE=.env.ci IMAGE_PREFIX=$(TEST_IMAGE_PREFIX) APP_VERSION=$(TEST_IMAGE_TAG) docker compose --env-file .env.ci -f compose.yaml -f compose.build.yaml

.PHONY: dev dev-up dev-down dev-setup front-dev back-dev test build up down ps logs pull e2e e2e-up e2e-run e2e-down

dev: dev-up

dev-up:
	$(DEV_DC) up -d --build --wait --wait-timeout 120 postgres s3 mercure mailer
	$(DEV_DC) run --rm --build s3-init

dev-down:
	$(DEV_DC) down

dev-setup: dev-up
	cd server && composer install --no-interaction
	npm --prefix client ci
	cd server && php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction
	cd server && php bin/console doctrine:migrations:migrate --no-interaction

front-dev:
	npm --prefix client run dev

back-dev:
	cd server && php -S 127.0.0.1:8000 -t public

test:
	server/bin/test-local

build:
	$(BUILD_DC) build

pull:
	$(DC) pull

up:
	$(DC) up -d --no-build --wait --wait-timeout 180

down:
	$(DC) down

ps:
	$(DC) ps

logs:
	$(DC) logs -f --tail=100

e2e:
	$(E2E_BUILD_DC) build
	$(MAKE) e2e-up
	$(MAKE) e2e-run

e2e-up:
	$(E2E_DC) --profile mailpit up -d --no-build --wait --wait-timeout 180

e2e-run:
	mkdir -p playwright-report test-results
	$(E2E_DC) --profile mailpit --profile e2e run --rm --no-deps playwright

e2e-down:
	$(E2E_DC) --profile mailpit --profile e2e down --volumes --remove-orphans
