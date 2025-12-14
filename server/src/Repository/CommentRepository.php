<?php

namespace App\Repository;

use App\Entity\Comment;
use App\Entity\Post;
use App\Modules\Identity\Domain\Entity\User;
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

    public function findRootForPost(
        Post $post,
        ?User $currentUser, 
        int $page, 
        int $limit
    ): array
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c')
            ->addSelect(
                '(SELECT COUNT(c2.id) 
                FROM App\Entity\Comment c2
                WHERE c2.parent = c) AS replyCount'
            )
            ->andWhere('c.post = :post')
            ->andWhere('c.parent IS NULL')
            ->setParameter('post', $post)
            ->orderBy('c.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
        
        if ($currentUser !== null) {
            $qb->addSelect(
                'CASE WHEN :currentUser MEMBER OF c.likeBy 
                THEN true ELSE false END AS likedByCurrentUser'
            )
            ->setParameter('currentUser', $currentUser);
        } else {
            $qb->addSelect('false AS likedByCurrentUser');
        }

        $comments = $qb->getQuery()->getResult();
        return $comments;
    }

    public function findReplies(Comment $parentComment, int $page, int $limit): array
    {
        $qb = $this->createQueryBuilder('c')
        ->andWhere('c.parent = :parentComment')
        ->setParameter('parentComment', $parentComment)
        ->orderBy('c.createdAt', 'ASC')
        ->setFirstResult(($page - 1) * $limit)
        ->setMaxResults($limit);

        $comments = $qb->getQuery()->getResult();

        return $comments;
    }
    
}
