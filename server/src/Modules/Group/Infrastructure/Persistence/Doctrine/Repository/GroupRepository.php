<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Application\DTO\GroupPreviewRawDTO;
use App\Modules\Group\Domain\Entity\Group;
use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
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

    public function findById(Uuid $groupId): ?Group
    {
        return $this->find($groupId);
    }

    public function findAllGroupsWithSubscribers(Uuid $currentUserId, int $page, $limit): array
    {
        $qb = $this->baseQB($currentUserId);

        $qb->andWhere('g.deletedAt IS NULL')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $result = $qb->getQuery()->getResult();
        return $result;
    }

    public function findByIdWithSubscribers(Uuid $currentUserId, Uuid $groupId): ?GroupPreviewRawDTO
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

    public function findAcceptedMemberGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array
    {
        $qb = $this->baseQB($currentUserId, $q)
            ->andWhere('gm.id IS NOT NULL')
            ->orderBy('g.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult(); // GroupPreviewRawDTO[]
    }

    public function findGroupsExceptAcceptedMember(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array
    {
        $qb = $this->baseQB($currentUserId, $q)
            ->andWhere('gm.id IS NULL')
            ->orderBy('g.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult(); // GroupPreviewRawDTO[]
    }

    public function findOwnedGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array
    {
        $qb = $this->baseQB($currentUserId, $q)
            ->andWhere('IDENTITY(g.owner) = :currentUserId')
            ->orderBy('g.createdAt', 'DESC')
            ->setParameter('currentUserId', $currentUserId)
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult(); // GroupPreviewRawDTO[]
    }



    private function baseQB(Uuid $currentUserId, ?string $q = null): QueryBuilder
    {
        $qb = $this->createQueryBuilder('g')
            // важный join: association-to-entity
            ->leftJoin(
                GroupMember::class,
                'gm',
                'WITH',
                'gm.group = g AND IDENTITY(gm.user) = :currentUserId AND gm.status = :accepted'
            )
            ->setParameter('currentUserId', $currentUserId)
            ->setParameter('accepted', GroupMemberStatusEnum::ACCEPTED)
            ->andWhere('g.deletedAt IS NULL');

        if ($q !== null && ($q = trim($q)) !== '') {
            $qb->andWhere('LOWER(g.name) LIKE :q')
                ->setParameter('q', '%' . mb_strtolower($q) . '%');
        }

        $qb->select(sprintf(
            'NEW %s(
            g.id,
            g.name,
            (CASE WHEN gm.id IS NOT NULL THEN true ELSE false END),
            g.subscribersCount,
            IDENTITY(g.currentAvatar)
        )',
            GroupPreviewRawDTO::class
        ));

        return $qb;
    }


}
