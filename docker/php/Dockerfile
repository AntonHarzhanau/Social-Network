FROM php:8.5-fpm

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

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/app

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
