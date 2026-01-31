<?php

namespace App\Modules\Media\Api;

use App\Modules\Media\Domain\Entity\MediaAsset;
use Symfony\Component\Uid\Uuid;

interface MediaApiInterface
{
    public function getMediaAssetById(Uuid $mediaId): ?MediaAsset;
    public function getMediaAssetsByIds(array $mediaIds): array;

    /** @return array<string, MediaItemDTO> */
    public function getMediasByIds(?Uuid $currentUser, array $ids): array;
}
