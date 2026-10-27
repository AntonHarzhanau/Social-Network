FROM php:8.5.12-fpm-trixie

ARG INSTALL_XDEBUG=0

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip zip curl bash \
    libpq-dev \
    libicu-dev \
    libzip-dev zlib1g-dev \
    libonig-dev \
  && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j"$(nproc)" \
    pdo_pgsql pgsql \
    intl \
    mbstring \
    zip

RUN docker-php-ext-enable opcache || true

RUN if [ "$INSTALL_XDEBUG" = "1" ]; then \
      pecl install xdebug && docker-php-ext-enable xdebug ; \
    fi

COPY --from=composer:2.10.3 /usr/bin/composer /usr/local/bin/composer

COPY docker/php/conf/x-php.ini /usr/local/etc/php/conf.d/custom.ini

WORKDIR /var/www/app

COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV APP_ENV=prod APP_DEBUG=0
COPY server/ ./
RUN touch .env \
    && composer install --no-dev --no-scripts --prefer-dist --optimize-autoloader --no-interaction --no-progress

HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=24 \
    CMD php -r '$s=@fsockopen("127.0.0.1",9000,$e,$m,2); if (!$s) exit(1); fclose($s);'

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]

