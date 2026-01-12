<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Domain\Entity\Wall;
use App\Modules\Feed\Domain\Repository\WallRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

final class WallRepository extends ServiceEntityRepository implements WallRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Wall::class);
    }

    public function getWallById(string $id): ?Wall
    {
        return $this->find($id);
    }
}
