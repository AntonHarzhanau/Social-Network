<?php

namespace App\Modules\Group\Infrastructure\Adapter;

use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Media\Api\MediaApiInterface;

final class MediaDirectoryAdapter implements MediaDirectoryInterface
{
    public function __construct(private readonly MediaApiInterface $mediaApi) {}

    public function getMediaItemsByIds(array $ids): array
    {
        return $this->mediaApi->getMediasByIds(null, $ids);
    }
}
