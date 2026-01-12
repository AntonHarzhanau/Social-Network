<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Domain\Entity\Group;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
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


    public function findAllGroups(int $page, $limit): array
    {
        // TODO: add filtering
        return parent::findBy([], ['createdAt' => 'ASC'], $limit, ($page - 1) * $limit);
    }

    public function findById(Uuid $id): ?Group
    {
        return $this->find($id);
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
            ->andWhere('g.wall IN (:wallIds)')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('wallIds', $wallIds)
            ->getQuery()
            ->getResult();
    }
}
