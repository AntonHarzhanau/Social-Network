<?php

namespace App\Repository;

use App\Entity\Comment;
use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comment>
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    public function save(Comment $comment, bool $flush = true): void
    {
        $this->getEntityManager()->persist($comment);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Comment $comment, bool $flush = true): void
    {
        $this->getEntityManager()->remove($comment);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findRootByPost(Post $post, int $page, int $limit): array
    {
        $page = max(1, $page);

        $comments = $this->findBy(
            ['post' => $post, 'parent' => null],
            ['createdAt' => 'DESC'],
            $limit,
            ($page - 1) * $limit
        );
        
        return $comments;
    }
    
}
