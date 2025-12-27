<?php

namespace App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Media\Domain\Entity\GroupMediaBinding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GroupMediaBinding>
 */
class GroupMediaBindingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GroupMediaBinding::class);
    }

}
