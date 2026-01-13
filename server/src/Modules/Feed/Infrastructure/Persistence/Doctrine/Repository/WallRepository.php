<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Domain\Entity\Wall;
use App\Modules\Feed\Domain\Repository\WallRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

final class WallRepository extends ServiceEntityRepository implements WallRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Wall::class);
    }

    public function save(Wall $wall, bool $flush = true): void
    {
        $this->getEntityManager()->persist($wall);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getWallById(Uuid $wallId): ?Wall
    {
        return $this->find($wallId);
    }
}
