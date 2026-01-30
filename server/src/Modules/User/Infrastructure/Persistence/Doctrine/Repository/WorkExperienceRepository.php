<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\WorkExperience;
use App\Modules\User\Domain\Repository\WorkExperienceRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<WorkExperience>
 */
class WorkExperienceRepository extends ServiceEntityRepository implements WorkExperienceRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WorkExperience::class);
    }

    public function save(WorkExperience $workExperience, bool $flush = true): void
    {
        $this->getEntityManager()->persist($workExperience);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(WorkExperience $workExperience, bool $flush = true): void
    {
        $this->getEntityManager()->remove($workExperience);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findOneById(Uuid $id): ?WorkExperience
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
    public function findCurrentOrLastForUser(Uuid $userId): ?WorkExperience
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
