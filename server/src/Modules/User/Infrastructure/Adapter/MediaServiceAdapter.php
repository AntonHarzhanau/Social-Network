<?php

namespace App\Modules\User\Infrastructure\Adapter;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\User\Application\Port\MediaServicePort;

final class MediaServiceAdapter implements MediaServicePort
{
    public function __construct(
        private readonly MediaApiInterface $mediaApi,
    ) {}

    public function getMediasByIds(array $ids): array
    {
        $result = $this->mediaApi->getMediasByIds($ids);
        $medias = [];
        foreach ($result as $mediaData) {
            $medias[] = $mediaData;
        }
        return $medias;
    }
}
