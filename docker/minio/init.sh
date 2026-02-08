#!/bin/sh
set -eu

require() {
  name="$1"
  eval "val=\${$name:-}"
  if [ -z "$val" ]; then
    echo "[s3-init] ERROR: $name is required"
    exit 1
  fi
}

require MINIO_ROOT_USER
require MINIO_ROOT_PASSWORD
require AWS_BUCKET
require AWS_ACCESS_KEY_ID
require AWS_SECRET_ACCESS_KEY

echo "[s3-init] waiting for MinIO (and auth)..."
tries=0
until mc alias set local http://s3:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null 2>&1; do
  tries=$((tries + 1))
  if [ "$tries" -ge 60 ]; then
    echo "[s3-init] ERROR: cannot auth to MinIO as root after 60s."
    echo "[s3-init] Check MINIO_ROOT_USER/MINIO_ROOT_PASSWORD and MinIO volume state."
    exit 1
  fi
  sleep 1
done

echo "[s3-init] ensure bucket exists: $AWS_BUCKET"
mc mb -p "local/$AWS_BUCKET" >/dev/null 2>&1 || true

# user: create if missing
if mc admin user info local "$AWS_ACCESS_KEY_ID" >/dev/null 2>&1; then
  echo "[s3-init] user exists: $AWS_ACCESS_KEY_ID"
else
  echo "[s3-init] create user: $AWS_ACCESS_KEY_ID"
  mc admin user add local "$AWS_ACCESS_KEY_ID" "$AWS_SECRET_ACCESS_KEY" >/dev/null
fi

echo "[s3-init] attach policy readwrite to user"
mc admin policy attach local readwrite --user "$AWS_ACCESS_KEY_ID" >/dev/null 2>&1 || true

echo "[s3-init] set anonymous download (public GET) on bucket"
mc anonymous set download "local/$AWS_BUCKET" >/dev/null 2>&1 || true

echo "[s3-init] OK"
