FROM golang:1.27.3-alpine3.24 AS server-build
RUN CGO_ENABLED=0 GOBIN=/out go install github.com/minio/minio@RELEASE.2025-10-15T17-29-55Z

FROM golang:1.27.3-alpine3.24 AS client-build
RUN CGO_ENABLED=0 GOBIN=/out go install github.com/minio/mc@RELEASE.2025-08-13T08-35-41Z

FROM alpine:3.24.3 AS server
RUN apk add --no-cache ca-certificates
COPY --from=server-build /out/minio /usr/local/bin/minio
HEALTHCHECK --interval=2s --timeout=3s --start-period=5s --retries=30 \
    CMD wget -q --spider http://127.0.0.1:9000/minio/health/live
ENTRYPOINT ["minio"]
CMD ["server", "/data", "--console-address", ":9001"]

FROM alpine:3.24.3 AS client
RUN apk add --no-cache ca-certificates
COPY --from=client-build /out/mc /usr/local/bin/mc
COPY --chmod=755 init.sh /usr/local/bin/init-storage
ENTRYPOINT ["/usr/local/bin/init-storage"]
CMD []
