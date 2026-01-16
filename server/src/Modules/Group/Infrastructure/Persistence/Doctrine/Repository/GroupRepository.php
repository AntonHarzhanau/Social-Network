<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Application\DTO\GroupPreviewRawDTO;
use App\Modules\Group\Application\DTO\GroupRawDTO;
use App\Modules\Group\Domain\Entity\Group;
use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Group>
 */
class GroupRepository extends ServiceEntityRepository implements GroupRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Group::class);
    }

    public function save(Group $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(Group $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }


    public function findAllGroups(Uuid $currentUserId, int $page, $limit): array
    {
        $qb = $this->baseQB($currentUserId);
       
            $qb->andWhere('g.deletedAt IS NULL')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $result = $qb->getQuery()->getResult();
        return $result;
    }

    public function findById(Uuid $currentUserId, Uuid $groupId): ?GroupRawDTO
    {
        $qb = $this->baseQB($currentUserId);
        $qb->andWhere('g.id = :groupId')
            ->setParameter('groupId', $groupId)
            ->andWhere('g.deletedAt IS NULL');
        return $qb->getQuery()->getOneOrNullResult();
    }

    /** @return array<string> wallIds */
    public function findWallIdsByGroupIds(array $groupIds): array
    {
        return $this->createQueryBuilder('g')
            ->select('IDENTITY(g.wall) AS wallId')
            ->andWhere('g.id IN (:ids)')
            ->setParameter('ids', $groupIds)
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function findGroupsByWallIds(array $wallIds): array
    {
        return $this->createQueryBuilder('g')
            ->select(sprintf(
                'NEW %s(
                g.id,
                g.name,
                IDENTITY(g.wall),
                IDENTITY(g.currentAvatar)
            )',
                GroupPreviewRawDTO::class
            ))
            ->andWhere('g.wall IN (:wallIds)')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('wallIds', $wallIds)
            ->getQuery()
            ->getResult();
    }

    private function baseQB(Uuid $currentUserId): QueryBuilder
    {
        $qb = $this->createQueryBuilder('g')
            ->leftJoin(
                GroupMember::class,
                'gm',
                'WITH',
                'gm.group = g.id AND gm.user = :currentUserId'
            )
            ->setParameter('currentUserId', $currentUserId)
            ->select(sprintf(
                'NEW %s(
                g.id,
                g.name,
                g.description,
                IDENTITY(g.wall),
                (CASE WHEN gm.id IS NOT NULL THEN true ELSE false END),
                g.subscribersCount,
                IDENTITY(g.currentAvatar)
            )',
                GroupRawDTO::class
            ));
        return $qb;
    }
}
