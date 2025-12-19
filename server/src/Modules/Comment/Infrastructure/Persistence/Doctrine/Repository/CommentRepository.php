<?php

namespace App\Modules\Comment\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Comment>
 */
class CommentRepository extends ServiceEntityRepository implements CommentRepositoryInterface
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
        Uuid $post,
        Uuid $currentUser,
        int $page,
        int $limit
    ): array {
        $qb = $this->createQueryBuilder('c')
            ->select('c AS comment')
            ->addSelect(
                '(SELECT COUNT(c2.id) 
                FROM App\Modules\Comment\Domain\Entity\Comment c2
                WHERE c2.parent = c) AS replyCount'
            )
            ->andWhere('IDENTITY(c.post) = :post')
            ->andWhere('c.parent IS NULL')
            ->setParameter('post', $post)
            ->orderBy('c.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->addSelect(
                'CASE WHEN :currentUser MEMBER OF c.likeBy 
                THEN true ELSE false END AS likedByCurrentUser'
            )
            ->setParameter('currentUser', $currentUser);

        $comments = $qb->getQuery()->getResult();
        return $comments;
    }

    public function findReplies(Comment $parentComment, Uuid $currentUser, int $page, int $limit): array
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c AS comment')
            ->addSelect(
                '(SELECT COUNT(c2.id) 
                FROM App\Modules\Comment\Domain\Entity\Comment c2
                WHERE c2.parent = c) AS replyCount'
            )
            ->andWhere('c.parent = :parentComment')
            ->setParameter('parentComment', $parentComment)
            ->orderBy('c.createdAt', 'ASC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->addSelect(
                'CASE WHEN :currentUser MEMBER OF c.likeBy 
                THEN true ELSE false END AS likedByCurrentUser'
            )
            ->setParameter('currentUser', $currentUser);

        $comments = $qb->getQuery()->getResult();
        return $comments;
    }

    public function findById(Uuid $id): ?Comment
    {
        return $this->find($id);
    }
}
