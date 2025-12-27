<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\UserPrivacySettings;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserPrivacySettings>
 */
class UserPrivacySettingsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserPrivacySettings::class);
    }

}
