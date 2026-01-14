<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Domain\Entity\GroupMediaBinding;
use App\Modules\Group\Domain\Repository\GroupMediaBindingsRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GroupMediaBinding>
 */
class GroupMediaBindingRepository extends ServiceEntityRepository implements GroupMediaBindingsRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GroupMediaBinding::class);
    }

}
