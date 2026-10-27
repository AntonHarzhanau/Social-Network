FROM node:24.22.1-alpine3.24 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV VITE_API_BASE=/api \
    VITE_MERCURE_URL=/.well-known/mercure \
    VITE_MEDIA_BASE=/media

RUN npm run build


FROM nginx:1.31.8-alpine3.24

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENV STATS_SCRIPT_URL="" \
    STATS_WEBSITE_ID="" \
    STATS_DOMAIN="" \
    NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html \
    NGINX_ENVSUBST_FILTER="^(STATS_SCRIPT_URL|STATS_WEBSITE_ID|STATS_DOMAIN)$"

COPY --from=build /app/dist/stats.js /etc/nginx/templates/stats.js.template

HEALTHCHECK --interval=5s --timeout=3s --retries=12 \
    CMD ["wget", "-q", "--spider", "http://127.0.0.1/"]
