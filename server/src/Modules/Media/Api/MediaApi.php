<?php

namespace App\Modules\Media\Api;

use App\Modules\Media\Application\Action\GetMediaItemsAction;

final class MediaApi implements MediaApiInterface
{
    public function __construct(
        private readonly GetMediaItemsAction $getMediaItems,
    ) {}

    /** @return array<string, MediaItemDTO> */
    public function getMediasByIds(array $ids): array
    {
        return $this->getMediaItems->execute($ids);
    }
}
