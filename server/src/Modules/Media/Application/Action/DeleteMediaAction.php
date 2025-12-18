<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\Port\MediaStorageInterface;
use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;

final class DeleteMediaAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaAssetRepository,
        private readonly MediaStorageInterface $mediaStorage,
    ) {}

    // at this moment do a soft delete
    public function __invoke(MediaAsset $media): void
    {
        if ($media->getDeletedAt() !== null) {
            return;
        }

        $media->setDeletedAt(new \DateTimeImmutable());
        $this->mediaAssetRepository->save($media);
        $this->mediaStorage->delete($media->getStorageKey());
    }
}
