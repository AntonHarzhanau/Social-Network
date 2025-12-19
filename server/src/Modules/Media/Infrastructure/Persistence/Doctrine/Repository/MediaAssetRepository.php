<?php

namespace App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<MediaAsset>
 */
class MediaAssetRepository extends ServiceEntityRepository implements MediaAssetRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaAsset::class);
    }

    public function save(MediaAsset $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(MediaAsset $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findById(Uuid $id): ?MediaAsset
    {
        return $this->find($id);
    }

    public function findByIds(array $ids): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.id IN (:ids)')
            ->setParameter('ids', $ids)
            ->getQuery()
            ->getResult();
    }

    public function findByOwnerId(Uuid $ownerId, int $limit = 20, int $offset = 0): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.owner = :ownerId')
            ->setParameter('ownerId', $ownerId)
            ->orderBy('m.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    
}
