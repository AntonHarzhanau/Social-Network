<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\EmailVerification;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\EmailVerificationRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EmailVerification>
 */
class EmailVerificationRepository extends ServiceEntityRepository implements EmailVerificationRepositoryInterface
{

    public function __construct(
        ManagerRegistry $registry,
    ) {
        parent::__construct($registry, EmailVerification::class);
    }

    public function findByTokenHash(string $tokenHash): ?EmailVerification
    {
        return $this->createQueryBuilder('ev')
            ->where('ev.tokenHash = :tokenHash')
            ->setParameter('tokenHash', $tokenHash)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findLatestPendingForUser(User $user): ?EmailVerification
    {
        return $this->createQueryBuilder('ev')
            ->where('ev.user = :user')
            ->andWhere('ev.consumedAt IS NULL')
            ->setParameter('user', $user)
            ->orderBy('ev.createdAt', 'DESC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function deletePendingForUser(User $user): int
    {
        return $this->createQueryBuilder('ev')
            ->delete()
            ->where('ev.user = :user')
            ->andWhere('ev.consumedAt IS NULL')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function save(EmailVerification $emailVerification, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($emailVerification);
        if ($flush) {
            $em->flush();
        }
    }

    public function delete(EmailVerification $emailVerification, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->remove($emailVerification);
        if ($flush) {
            $em->flush();
        }
    }
    public function getEmailVerificationByEmail(string $email): ?EmailVerification
    {
        return $this->createQueryBuilder('ev')
            ->where('ev.sentEmail = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
