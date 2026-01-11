<?php

namespace App\Modules\Media\Domain\Repository;

use App\Modules\Media\Application\DTO\MediaItemRowDTO;
use App\Modules\Media\Domain\Entity\MediaAsset;
use Symfony\Component\Uid\Uuid;

interface MediaAssetRepositoryInterface
{
    public function save(MediaAsset $media, bool $flush = true): void;

    public function delete(MediaAsset $media, bool $flush = true): void;

    public function findById(Uuid $id): ?MediaAsset;

    /** @return list<MediaAsset> */
    public function findByIds(array $ids): array;

    /** @return list<MediaAsset> */
    public function findByOwnerId(Uuid $ownerId, int $limit = 20, int $offset = 0): array;
   
    /** @return list<MediaAsset> */
    public function findAll(): array;

    public function findMediaRowsByIds(Uuid $currentUser, array $ids): array;

     public function getMediaItemById(Uuid $mediaId, Uuid $currentUserId): ?MediaItemRowDTO;
}
