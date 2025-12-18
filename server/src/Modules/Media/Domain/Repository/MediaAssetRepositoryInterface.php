<?php

namespace App\Modules\Media\Domain\Repository;

use App\Modules\Media\Domain\Entity\MediaAsset;
use Symfony\Component\Uid\Uuid;

interface MediaAssetRepositoryInterface
{
    public function save(MediaAsset $media, bool $flush = true): void;

    public function delete(MediaAsset $media, bool $flush = true): void;

    public function findById(Uuid $id): ?MediaAsset;

    /** @return list<MediaAsset> */
    public function findByOwnerId(Uuid $ownerId, int $limit = 20, int $offset = 0): array;
}
