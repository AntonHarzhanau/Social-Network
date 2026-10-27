FROM nginx:1.31.8-alpine3.24
COPY nginx.conf /etc/nginx/nginx.conf
HEALTHCHECK --interval=5s --timeout=3s --retries=12 \
    CMD wget -q --spider http://127.0.0.1/health
