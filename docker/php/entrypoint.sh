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

  APP_ENV="${APP_ENV:-dev}"

  # -------------------------
  # ALWAYS fix permissions for Symfony var/ (named volume symfony_var)
  # -------------------------
  echo "[entrypoint] Fixing permissions for var/ (env=${APP_ENV})..."
  mkdir -p var/cache var/log
  if [ "$APP_ENV" = "prod" ]; then
    mkdir -p var/cache/prod
  else
    mkdir -p var/cache/dev
  fi
  chown -R www-data:www-data var || true
  chmod -R ug+rwX var || true

  if [ -f "composer.json" ] && [ ! -f "vendor/autoload.php" ]; then
    echo "[entrypoint] vendor/ missing -> running composer install..."
    if [ "$APP_ENV" = "prod" ]; then
      composer install --no-dev --optimize-autoloader --no-interaction --no-progress
    else
      composer install --no-interaction --no-progress
    fi
  fi

  # -------------------------
  # Wait postgres DNS + TCP
  # -------------------------
  echo "[entrypoint] Waiting for postgres DNS..."
  until php -r 'exit(gethostbyname("postgres")==="postgres");' ; do
    echo "[entrypoint] postgres DNS not ready, retry..."
    sleep 1
  done

  echo "[entrypoint] Waiting for postgres TCP 5432..."
  until php -r '$s=@fsockopen("postgres",5432,$e,$m,1); if(!$s){exit(1);} fclose($s);' ; do
    echo "[entrypoint] postgres:5432 not ready, retry..."
    sleep 1
  done

  echo "[entrypoint] Waiting DB + applying migrations..."

  max_tries=60
  i=0

  until php bin/console doctrine:database:create --if-not-exists --no-interaction --env="$APP_ENV"; do
    i=$((i + 1))
    if [ "$i" -ge "$max_tries" ]; then
      echo "[entrypoint] ERROR: DB not ready after ${max_tries}s, abort."
      exit 1
    fi
    echo "[entrypoint] DB not ready yet, retry... (${i}/${max_tries})"
    sleep 1
  done

  php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration --env="$APP_ENV"
  php bin/console messenger:setup-transports --no-interaction --env="$APP_ENV" || true

  if [ "$APP_ENV" = "prod" ]; then
    echo "[entrypoint] Warming up cache (prod)..."
    su -s /bin/sh www-data -c 'php bin/console cache:warmup --env=prod' || true
  fi

  echo "[entrypoint] Done."
fi

exec "$@"
