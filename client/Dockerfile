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


HEALTHCHECK --interval=5s --timeout=3s --retries=12 \
    CMD ["wget", "-q", "--spider", "http://127.0.0.1/"]
