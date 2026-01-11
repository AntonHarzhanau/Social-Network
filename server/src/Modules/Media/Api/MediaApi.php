<?php

namespace App\Modules\Media\Api;

use App\Modules\Media\Application\Action\GetMediaItemsAction;
use App\Modules\Media\Application\Action\GetMediaItemsWithLikeAction;
use Symfony\Component\Uid\Uuid;

final class MediaApi implements MediaApiInterface
{
    public function __construct(
        private readonly GetMediaItemsAction $getMediaItems,
        private readonly GetMediaItemsWithLikeAction $getMediaItemsWithLikes,
    ) {}

    /** @return array<string, MediaItemDTO> */
    public function getMediasByIds(?Uuid $currentUser, array $ids): array
    {
        if ($currentUser === null) {
            return $this->getMediaItems->execute($ids);
        }
        return $this->getMediaItemsWithLikes->execute($currentUser, $ids);
    }
}
