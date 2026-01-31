<?php

namespace App\Modules\Media\Application\Service;

use App\Modules\Media\Application\Port\MediaStorageInterface;

final class GetMediaUrl
{
    public function __construct(
        private readonly MediaStorageInterface $mediaStorage,
    ) {}

    public function __invoke(string $storageKey, bool $signed = false, int $ttlSecond = 3600)
    {
        return $signed
            ? $this->mediaStorage->signedUrl($storageKey, $ttlSecond)
            : $this->mediaStorage->publicUrl($storageKey);
    }
}
