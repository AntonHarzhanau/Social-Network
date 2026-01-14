<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\ChatMediaBindings;
use App\Modules\Chat\Domain\Repository\ChatMediaBindingsRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ChatMediaBindings>
 */
class ChatMediaBindingsRepository extends ServiceEntityRepository implements ChatMediaBindingsRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatMediaBindings::class);
    }

}
