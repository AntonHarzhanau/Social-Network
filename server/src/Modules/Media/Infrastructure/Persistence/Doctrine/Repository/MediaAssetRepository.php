<?php

namespace App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\Media\Domain\Repository\MediaassetRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MediaAsset>
 */
class MediaAssetRepository extends ServiceEntityRepository implements MediaassetRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaAsset::class);
    }

}
