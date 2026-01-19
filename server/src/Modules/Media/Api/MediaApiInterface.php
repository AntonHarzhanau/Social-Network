<?php

namespace App\Modules\Media\Api;

use Symfony\Component\Uid\Uuid;

interface MediaApiInterface
{
    public function getMediaAssetById(Uuid $mediaId);
    public function getMediaAssetsByIds(array $mediaIds): array;

    /** @return array<string, MediaItemDTO> */
    public function getMediasByIds(?Uuid $currentUser, array $ids): array;
}
