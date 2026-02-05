#!/usr/bin/env sh
set -eu

run_as_app() {
  if [ "$(id -u)" = "0" ]; then
    gosu www-data:www-data "$@"
  else
    "$@"
  fi
}

is_php_fpm=0
if [ "${1:-}" = "php-fpm" ] || [ "${1:-}" = "php-fpm8.5" ]; then
  is_php_fpm=1
fi

if [ "$is_php_fpm" -eq 1 ]; then
  cd /var/www/app

  if [ ! -f "bin/console" ]; then
    echo "[entrypoint] bin/console not found, skipping bootstrap."
    exec "$@"
  fi

  # гарантируем writable директории (они у нас в volume, но по умолчанию root:root)
  mkdir -p var/cache var/log
  if [ "$(id -u)" = "0" ]; then
    chown -R www-data:www-data var || true
    mkdir -p vendor
    chown -R www-data:www-data vendor || true
  fi

  if [ -f "composer.json" ] && [ ! -f "vendor/autoload.php" ]; then
    echo "[entrypoint] vendor/ missing -> running composer install..."

    APP_ENV="${APP_ENV:-dev}"
    if [ "$APP_ENV" = "prod" ]; then
      run_as_app composer install --no-dev --optimize-autoloader --no-interaction --no-progress
    else
      run_as_app composer install --no-interaction --no-progress
    fi
  fi

  echo "[entrypoint] Waiting DB + applying migrations..."

  max_tries=60
  i=0

  until run_as_app php bin/console doctrine:database:create --if-not-exists --no-interaction; do
    i=$((i+1))
    if [ "$i" -ge "$max_tries" ]; then
      echo "[entrypoint] ERROR: DB not ready after ${max_tries}s, abort."
      exit 1
    fi
    echo "[entrypoint] DB not ready yet, retry... (${i}/${max_tries})"
    sleep 1
  done

  run_as_app php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
  run_as_app php bin/console messenger:setup-transports --no-interaction || true

  # чтобы в prod кэш был прогрет (и не строился на первом запросе)
  if [ "${APP_ENV:-dev}" = "prod" ]; then
    run_as_app php bin/console cache:clear --no-interaction --no-warmup
    run_as_app php bin/console cache:warmup --no-interaction
  fi

  echo "[entrypoint] Done."
fi

exec "$@"
