<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

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
        try {
            $this->getEntityManager()->persist($entity);
            if ($flush) {
                $this->getEntityManager()->flush();
            }
        } catch (UniqueConstraintViolationException $e) {
            throw new \DomainException('User is already a member of this group.');
        }

    }

    public function delete(GroupMember $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findMembersByGroupId(Uuid $groupId): array
    {
        return $this->createQueryBuilder('gm')
            ->andWhere('gm.group = :groupId')
            ->setParameter('groupId', $groupId)
            ->getQuery()
            ->getResult();
    }

    public function findOneByCriteria(array $criteria): ?GroupMember
    {
        return $this->findOneBy($criteria);
    }
}
