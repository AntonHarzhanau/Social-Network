<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Domain\Entity\PostLike;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;


final class PostLikeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PostLike::class);
    }

    public function save(PostLike $postLike, bool $flush = true): void
    {
        $this->getEntityManager()->persist($postLike);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PostLike $postLike, bool $flush = true): void
    {
        $this->getEntityManager()->remove($postLike);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}
