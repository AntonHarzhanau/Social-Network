<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\Education;
use App\Modules\User\Domain\Repository\EducationRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Education>
 */
class EducationRepository extends ServiceEntityRepository implements EducationRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Education::class);
    }

    public function save(Education $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(Education $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findOneById(Uuid $id): ?Education
    {
        return $this->find($id);
    }

    public function findAllByUserId(Uuid $userId): array
    {
        $qb = $this->createQueryBuilder('e')
            ->andWhere('IDENTITY(e.user) = :userId')
            ->setParameter('userId', $userId)
            ->addSelect('COALESCE(e.endAt, e.startAt) AS HIDDEN sortDate')
            ->orderBy('sortDate', 'DESC')
            ->addOrderBy('e.startAt', 'DESC');

        return $qb->getQuery()->getResult();
    }


    public function findCurrentOrLastForUser(Uuid $userId): ?Education
    {
        $qb = $this->createQueryBuilder('e')
            ->andWhere('IDENTITY(e.user) = :userId')
            ->setParameter('userId', $userId)
            ->addSelect('CASE WHEN e.endAt IS NULL THEN 1 ELSE 0 END AS HIDDEN isCurrent')
            ->addSelect('COALESCE(e.endAt, e.startAt) AS HIDDEN sortDate')
            ->orderBy('isCurrent', 'DESC')
            ->addOrderBy('sortDate', 'DESC')
            ->addOrderBy('e.startAt', 'DESC')
            ->setMaxResults(1);

        return $qb->getQuery()->getOneOrNullResult();
    }
}
