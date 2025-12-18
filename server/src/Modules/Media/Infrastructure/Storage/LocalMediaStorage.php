<?php

declare(strict_types=1);

namespace App\Modules\Media\Infrastructure\Storage;

use App\Modules\Media\Application\Port\MediaStorageInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class LocalMediaStorage 
{
    public function __construct(
        #[Autowire('%media_storage_root%')]
        private string $mediaStorageRoot,
        #[Autowire('%media_public_base_url%')]
        private string $publicBaseUrl,
    ) {}

    public function store(UploadedFile $file, string $storageKey, ?string $mimeType = null): void
    {
        $targetPath = $this->mediaStorageRoot . '/' . ltrim($storageKey, '/');
        $targetDir = \dirname($targetPath);

        if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
            throw new \RuntimeException(sprintf('Directory "%s" was not created', $targetDir));
        }

        $file->move($targetDir, basename($targetPath));
    }

    public function delete(string $storageKey): void
    {
        $path = $this->mediaStorageRoot . '/' . ltrim($storageKey, '/');
        if (is_file($path)) {
            unlink($path);
        }
    }

    public function publicUrl(string $storageKey): string
    {
        return rtrim($this->publicBaseUrl, '/') . '/' . ltrim($storageKey, '/');
    }

    public function signedUrl(string $storageKey, int $ttlSeconds = 3600): string
    {
        return $this->publicUrl($storageKey);
    }
}
