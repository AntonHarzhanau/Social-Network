<?php

namespace App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Media\Application\DTO\MediaItemRowDTO;
use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
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

    public function findAll(): array
    {
        return $this->createQueryBuilder('m')
            ->orderBy('m.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param string[] $ids RFC4122
     * @return MediaItemRowDTO[]
     */
    public function findMediaRowsByIds(Uuid $currentUserId, array $ids): array
    {
        if ($ids === []) return [];

        $qb = $this->createQueryBuilder('m')
            ->select(sprintf(
                'NEW %s(
                m.id,
                m.storageKey,
                m.fileType,
                m.createdAt,
                m.width,
                m.height,
                m.durationSeconds,
                ct.id,
                m.likeCount,
                CASE WHEN COUNT(lb) > 0 THEN true ELSE false END
            )',
                MediaItemRowDTO::class
            ))
            ->innerJoin('m.commentThread', 'ct')
            ->leftJoin('m.likeBy', 'lb', 'WITH', 'lb.id = :meId')
            ->setParameter('meId', $currentUserId)
            ->where('m.id IN (:ids)')
            ->setParameter('ids', $ids)
            ->andWhere('m.deletedAt IS NULL')
            ->groupBy('m.id, m.storageKey, m.fileType, m.createdAt, m.width, m.height, m.durationSeconds, ct.id, m.likeCount');

        /** @var MediaItemRowDTO[] */
        return $qb->getQuery()->getResult();
    }


    public function getMediaItemById(Uuid $mediaId, Uuid $currentUserId): ?MediaItemRowDTO
    {
        $qb = $this->createQueryBuilder('m')
            ->select(sprintf(
                'NEW %s(
                m.id,
                m.storageKey,
                m.fileType,
                m.createdAt,
                m.width,
                m.height,
                m.durationSeconds,
                ct.id,
                m.likeCount,
                CASE WHEN COUNT(lb) > 0 THEN true ELSE false END
            )',
                MediaItemRowDTO::class
            ))
            ->innerJoin('m.commentThread', 'ct')
            ->leftJoin('m.likeBy', 'lb', 'WITH', 'lb.id = :meId')
            ->setParameter('meId', $currentUserId)
            ->where('m.id = :id')
            ->setParameter('id', $mediaId)
            ->andWhere('m.deletedAt IS NULL')
            ->groupBy('m.id, m.storageKey, m.fileType, m.createdAt, m.width, m.height, m.durationSeconds, ct.id, m.likeCount');

        try {
            /** @var MediaItemRowDTO|null $row */
            $row = $qb->getQuery()->getOneOrNullResult();
            return $row;
        } catch (NonUniqueResultException) {
            return null;
        }
    }
}
