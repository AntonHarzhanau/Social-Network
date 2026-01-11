<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Api\DTO\MediaItemDTO;
use App\Modules\Media\Application\Mapper\MediaItemMapper;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetMediaItemsWithLikeAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaRepository,
        private readonly MediaItemMapper $mediaItemMapper,
    ) {}

    /** @return array<string, MediaItemDTO> */
    public function execute(Uuid $currentUser, array $ids): array
    {
        $medias = $this->mediaRepository->findMediaRowsByIds($currentUser, $ids);
        $mediaItems = [];
        foreach ($medias as $media) {
            $mediaItems[$media->id->toRfc4122()] = $this->mediaItemMapper->fromRow($media);
        }

        return $mediaItems;
    }
}
