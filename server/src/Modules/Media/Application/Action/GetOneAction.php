<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\DTO\MediaItemRowDTO;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetOneAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaRepository,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $mediaId): ?MediaItemRowDTO {
        $media = $this->mediaRepository->getMediaItemById($mediaId, $currentUserId);
        return $media;
    }
}
