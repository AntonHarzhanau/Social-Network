<?php

namespace App\Modules\Feed\Application\Port;

interface MediaAssetDirectoryInterface
{
    public function getMediaAssetsByIds(array $mediaIds): array;


    public function getMediaItems(array $mediaIds): array;
}
