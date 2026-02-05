#!/usr/bin/env sh
set -eu

is_php_fpm=0
if [ "${1:-}" = "php-fpm" ] || [ "${1:-}" = "php-fpm8.5" ]; then
  is_php_fpm=1
fi

if [ "$is_php_fpm" -eq 1 ]; then
  if [ ! -f "bin/console" ]; then
    echo "[entrypoint] bin/console not found, skipping bootstrap."
    exec "$@"
  fi

  if [ -f "composer.json" ] && [ ! -f "vendor/autoload.php" ]; then
    echo "[entrypoint] vendor/ missing -> running composer install..."

    APP_ENV="${APP_ENV:-dev}"
    if [ "$APP_ENV" = "prod" ]; then
      composer install --no-dev --optimize-autoloader --no-interaction --no-progress
    else
      composer install --no-interaction --no-progress
    fi
  fi

  echo "[entrypoint] Waiting DB + applying migrations..."

  max_tries=60
  i=0

  until php bin/console doctrine:database:create --if-not-exists --no-interaction; do
    i=$((i+1))
    if [ "$i" -ge "$max_tries" ]; then
      echo "[entrypoint] ERROR: DB not ready after ${max_tries}s, abort."
      exit 1
    fi
    echo "[entrypoint] DB not ready yet, retry... (${i}/${max_tries})"
    sleep 1
  done

  php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
  php bin/console messenger:setup-transports --no-interaction || true

  echo "[entrypoint] Done."
fi

exec "$@"
