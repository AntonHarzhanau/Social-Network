<?php

namespace App\Modules\Media\Application\Service;

use App\Modules\Media\Application\Port\MediaStorageInterface;
use App\Modules\Media\Domain\Entity\MediaAsset;

final class GetMediaUrl
{
    public function __construct(
        private readonly MediaStorageInterface $mediaStorage,
    ) {}

    public function __invoke(MediaAsset $media, bool $signed = false, int $ttlSecond = 3600)
    {
        return $signed
            ? $this->mediaStorage->signedUrl($media->getStorageKey(), $ttlSecond)
            : $this->mediaStorage->publicUrl($media->getStorageKey());
    }
}
