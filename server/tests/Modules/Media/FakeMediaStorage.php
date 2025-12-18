<?php

namespace App\Tests\Modules\Media;

use App\Modules\Media\Application\Port\MediaStorageInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class FakeMediaStorage implements MediaStorageInterface
{

    public function __construct(private string $baseUrl = 'http://test.local/media') {}

    public function store(UploadedFile $file, string $storageKey, ?string $mimeType = null): void {}

    public function delete(string $storageKey): void {}

    public function publicUrl(string $storageKey): string
    {
            return rtrim($this->baseUrl, '/') . '/' . ltrim($storageKey, '/');
    }

    public function signedUrl(string $storageKey, int $ttlSeconds = 3600): string
    {
        return $this->publicUrl($storageKey) . '?signed=1';
    }
}
