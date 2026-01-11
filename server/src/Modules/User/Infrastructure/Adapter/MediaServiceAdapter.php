<?php

namespace App\Modules\User\Infrastructure\Adapter;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\User\Application\Port\MediaServicePort;
use Symfony\Component\Uid\Uuid;

final class MediaServiceAdapter implements MediaServicePort
{
    public function __construct(
        private readonly MediaApiInterface $mediaApi,
    ) {}

    public function getMediasByIds(?Uuid $currentUser, array $ids): array
    {
        $result = $this->mediaApi->getMediasByIds($currentUser, $ids);
        $medias = [];
        foreach ($result as $mediaData) {
            $medias[] = $mediaData;
        }
        return $medias;
    }
}
