#!/usr/bin/env sh
set -eu

if [ "${1:-}" = php-fpm ]; then
    test -f vendor/autoload.php || { echo 'Missing dependencies in the PHP image.' >&2; exit 1; }
    rm -rf var/cache
    mkdir -p var/cache var/log config/jwt
    chown -R www-data:www-data var config/jwt
    chmod -R ug+rwX var

    php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction
    chown -R www-data:www-data config/jwt
    chmod -R u=rwX,g=rX,o= config/jwt

    attempt=0
    until php bin/console doctrine:database:create --if-not-exists --no-interaction; do
        attempt=$((attempt + 1))
        [ "$attempt" -lt 30 ] || exit 1
        sleep 2
    done
    php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
    php bin/console messenger:setup-transports --no-interaction
    chown -R www-data:www-data var
    su -s /bin/sh www-data -c 'php bin/console cache:warmup'
fi

exec "$@"
