<?php

namespace App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Media\Domain\Entity\ChatMediaBindings;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ChatMediaBindings>
 */
class ChatMediaBindingsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatMediaBindings::class);
    }

}
