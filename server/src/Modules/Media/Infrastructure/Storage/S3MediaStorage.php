<?php

namespace App\Modules\Media\Infrastructure\Storage;

use App\Modules\Media\Application\Port\MediaStorageInterface;
use Aws\S3\S3Client;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class S3MediaStorage implements MediaStorageInterface
{
    public function __construct(
        private S3Client $s3,
        #[Autowire(env: 'AWS_BUCKET')]
        private string $bucket,
        #[Autowire(env: 'AWS_PUBLIC_ENDPOINT')]
        private string $publicEndpoint,
    ) {}

    public function store(UploadedFile $file, string $storageKey, ?string $mimeType = null): void
    {
        $size = $file->getSize() ?: 0;

        $this->s3->putObject([
            'Bucket' => $this->bucket,
            'Key' => $storageKey,
            'Body' => fopen($file->getPathname(), 'rb'),
            'ContentType' => $mimeType ?? ($file->getClientMimeType() ?? 'application/octet-stream'),
            'ContentLength' => $size,
        ]);
    }

    public function delete(string $storageKey): void
    {
        $this->s3->deleteObject([
            'Bucket' => $this->bucket,
            'Key' => $storageKey,
        ]);
    }

    public function publicUrl(string $storageKey): string
    {
        $base = rtrim($this->publicEndpoint, '/'); // http://localhost:8098/media
        $key  = ltrim($storageKey, '/');

        // return sprintf('%s/%s/%s', $base, $this->bucket, $key);
        return sprintf('%s/%s', $base, $key);
    }

    public function signedUrl(string $storageKey, int $ttlSeconds = 3600): string
    {
        // В варианте B обычно не нужно: бакет public и ссылки идут через nginx.
        // Если вдруг нужен presigned URL в браузер — это отдельная настройка, т.к. HOST участвует в подписи.
        $cmd = $this->s3->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $storageKey,
        ]);

        $request = $this->s3->createPresignedRequest($cmd, sprintf('+%d seconds', $ttlSeconds));

        return (string) $request->getUri();
    }
}
