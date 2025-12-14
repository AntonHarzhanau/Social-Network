<?php

namespace App\Modules\Auth\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Auth\Domain\Entity\EmailVerification;
use App\Modules\Auth\Domain\Repository\EmailVerificationRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EmailVerification>
 */
class EmailVerificationRepository extends ServiceEntityRepository implements EmailVerificationRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EmailVerification::class);
    }

}
