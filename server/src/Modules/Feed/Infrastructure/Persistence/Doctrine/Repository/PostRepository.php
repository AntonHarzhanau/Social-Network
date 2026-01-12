<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository implements PostRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    public function save(Post $post, bool $flush = true): void
    {
        $this->getEntityManager()->persist($post);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Post $post, bool $flush = true): void
    {
        $this->getEntityManager()->remove($post);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findOneById(Uuid $id): ?Post
    {
        return $this->find($id);
    }
}
