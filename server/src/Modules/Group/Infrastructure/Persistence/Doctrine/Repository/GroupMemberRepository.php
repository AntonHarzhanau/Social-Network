<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GroupMember>
 */
class GroupMemberRepository extends ServiceEntityRepository implements GroupMemberRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GroupMember::class);
    }

    public function save(GroupMember $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(GroupMember $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findMembersByGroupId(string $groupId): array
    {
        return $this->createQueryBuilder('gm')
            ->andWhere('gm.group = :groupId')
            ->setParameter('groupId', $groupId)
            ->getQuery()
            ->getResult();
    }
}
