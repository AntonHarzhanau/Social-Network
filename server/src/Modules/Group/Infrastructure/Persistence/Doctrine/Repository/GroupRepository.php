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

    /** @return array<string> wallIds */
    public function findWallIdsByUserId(Uuid $userId): array
    {
        $qb = $this->createQueryBuilder('g')
            ->innerJoin(
                GroupMember::class,
                'gm',
                'WITH',
                'gm.group = g AND IDENTITY(gm.user) = :currentUserId'
            )
            ->select('DISTINCT IDENTITY(g.wall)')
            ->andWhere('g.deletedAt IS NULL')
            ->andWhere('gm.status = :accepted')
            ->setParameter('currentUserId', $userId)
            ->setParameter('accepted', GroupMemberStatusEnum::ACCEPTED);

        return $qb->getQuery()->getSingleColumnResult();
    }


    public function findGroupsByWallIds(Uuid $currentUserId, array $wallIds): array
    {
        $qb = $this->baseQB($currentUserId)
            ->andWhere('g.wall IN (:wallIds)')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('wallIds', $wallIds);
        $result = $qb->getQuery()->getResult();
        return $result;
    }

    public function findAcceptedMemberGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array
    {
        $qb = $this->baseQB($currentUserId, $q)
            ->andWhere('gm.id IS NOT NULL')
            ->orderBy('g.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
        return $qb->getQuery()->getResult();
    }

    public function findAllGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array
    {
        $qb = $this->baseQB($currentUserId, $q)
            ->orderBy('g.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }

    public function findOwnedGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array
    {
        $qb = $this->baseQB($currentUserId, $q)
            ->andWhere('gm.id IS NOT NULL')
            ->andWhere('IDENTITY(g.owner) = :currentUserId')
            ->orderBy('g.createdAt', 'DESC')
            ->setParameter('currentUserId', $currentUserId)
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }



    private function baseQB(Uuid $currentUserId, ?string $q = null): QueryBuilder
    {
        $qb = $this->createQueryBuilder('g')
            ->leftJoin(
                GroupMember::class,
                'gm',
                'WITH',
                'gm.group = g AND IDENTITY(gm.user) = :currentUserId'
            )
            ->setParameter('currentUserId', $currentUserId)
            ->andWhere('g.deletedAt IS NULL')
            ->andWhere('(gm.id IS NULL OR gm.status != :banned)')
            ->setParameter('banned', GroupMemberStatusEnum::BANNED);


        if ($q !== null && ($q = trim($q)) !== '') {
            $qb->andWhere('LOWER(g.name) LIKE :q')
                ->setParameter('q', '%' . mb_strtolower($q) . '%');
        }

        $qb->select(\sprintf(
            'NEW %s(
            g.id,
            g.name,
            IDENTITY(g.wall),
            (CASE WHEN gm.id IS NOT NULL THEN true ELSE false END),
            gm.role,
            gm.status,
            g.subscribersCount,
            IDENTITY(g.currentAvatar),
            g.visibility
        )',
            GroupPreviewRawDTO::class
        ));

        return $qb;
    }


}
