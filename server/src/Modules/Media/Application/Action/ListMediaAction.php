<?php

namespace App\Modules\Media\Application\Action;

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
        return $this->mediaAssetRepository->findAll();
    }
}
