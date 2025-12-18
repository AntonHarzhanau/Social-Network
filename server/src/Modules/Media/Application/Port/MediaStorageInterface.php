<?php

namespace App\Modules\Media\Application\Port;

use Symfony\Component\HttpFoundation\File\UploadedFile;

interface MediaStorageInterface
{
    public function store(UploadedFile $file, string $storageKey, ?string $mimeType = null): void;

    public function delete(string $storageKey): void;

    public function publicUrl(string $storageKey): string;

    public function signedUrl(string $storageKey, int $ttlSeconds = 3600): string;
}
