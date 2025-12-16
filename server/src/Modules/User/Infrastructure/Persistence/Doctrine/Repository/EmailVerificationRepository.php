<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Infrastructure\Persistence\Doctrine\Entity\DoctrineEmailVerification;
use App\Modules\User\Infrastructure\Persistence\Doctrine\Entity\DoctrineUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EmailVerification>
 */
class EmailVerificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DoctrineEmailVerification::class);
    }

    public function findByTokenHash(string $tokenHash): ?DoctrineEmailVerification
    {
        return $this->createQueryBuilder('ev')
            ->where('ev.tokenHash = :tokenHash')
            ->setParameter('tokenHash', $tokenHash)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findLatestPendingForUser(DoctrineUser $user): ?DoctrineEmailVerification
    {
        return $this->createQueryBuilder('ev')
            ->where('ev.user = :user')
            ->andWhere('ev.consumedAt IS NULL')
            ->setParameter('user', $user)
            ->orderBy('ev.createdAt', 'DESC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function deletePendingForUser(DoctrineUser $user): int
    {
        return $this->createQueryBuilder('ev')
            ->delete()
            ->where('ev.user = :user')
            ->andWhere('ev.consumedAt IS NULL')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function save(DoctrineEmailVerification $emailVerification, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($emailVerification);
        if ($flush) {
            $em->flush();
        }
    }
}
