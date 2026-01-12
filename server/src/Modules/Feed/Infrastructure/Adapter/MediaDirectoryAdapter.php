<?php

namespace App\Modules\Feed\Infrastructure\Adapter;

use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Media\Api\MediaApiInterface;
use Symfony\Component\Uid\Uuid;

class MediaDirectoryAdapter implements MediaAssetDirectoryInterface
{
    public function __construct(
        private readonly MediaApiInterface $mediaApi,
    ) {}
   
    public function getMediaAssetsByIds(array $mediaIds): array
    {
        return $this->mediaApi->getMediaAssetsByIds($mediaIds);
    }

    public function getMediaItems(array $mediaIds): array
    {
      return $this->mediaApi->getMediasByIds(null, $mediaIds); 
    }
}
