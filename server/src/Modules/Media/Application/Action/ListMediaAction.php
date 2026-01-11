<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Api\DTO\MediaItemDTO;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListMediaAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaAssetRepository,
    ) {}

    /** @return list<MediaAsset> */
    public function __invoke(
        Uuid $ownerId,
        int $limit = 20,
        int $offset = 0
    ): array 
    {
        $medias = $this->mediaAssetRepository->findAll();
        $result = [];
        foreach ($medias as $media) {
            $result[] = new MediaItemDTO(
                id: (string) $media->getId(),
                url: '', // URL generation logic can be added here
                type: $media->getFileType()?->value ?? 'unknown',
                createdAt: $media->getCreatedAt(),
                width: $media->getWidth(),
                height: $media->getHeight(),
                durationSeconds: $media->getDurationSeconds(),
                commentThreadId: $media->getCommentThread()->getId()->toRfc4122(),
                likeCount: $media->getLikeCount(),
            );
        }
        return $result;
    }
}
