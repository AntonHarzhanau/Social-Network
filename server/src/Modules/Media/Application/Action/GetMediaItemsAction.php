<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Api\DTO\MediaItemDTO;
use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;

final class GetMediaItemsAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaRepository,
        private readonly GetMediaUrl $getMediaUrl,
    ) {}

    /** @return array<string, MediaItemDTO> */
    public function execute(array $ids): array
    {
        $medias = $this->mediaRepository->findByIds($ids);
        $mediaItems = [];
        foreach ($medias as $media) {
            $mediaItems[$media->getId()->toRfc4122()] = new MediaItemDTO(
                id: $media->getId()->toRfc4122(),
                url: ($this->getMediaUrl)($media->getStorageKey()),
                type: $media->getFileType()->value,
                createdAt: $media->getCreatedAt(),
                width: $media->getWidth(),
                height: $media->getHeight(),
                durationSeconds: $media->getDurationSeconds(),
                commentThreadId: $media->getCommentThread()->getId()->toRfc4122(),
                likeCount: $media->getLikeCount(),
            );
        }

        return $mediaItems;
    }
}
