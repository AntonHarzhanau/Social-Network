<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Application\DTO\PostFeedRowDTO;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\User\Domain\Entity\User;
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

    public function findPosts(
        User $currentUser,
        ?Uuid $authorId = null,
        ?string $id = null,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null
    ): array {
        $qb = $this->createQueryBuilder('p')
            ->select(sprintf(
                'NEW %s(
                p.id,
                p.content,
                p.likeCount,
                t.commentCount,
                CASE WHEN COUNT(lb) > 0 THEN true ELSE false END,
                p.createdAt,
                a.id,
                t.id
            )',
                PostFeedRowDTO::class
            ))
            ->join('p.author', 'a')
            ->innerJoin('p.commentThread', 't')
            ->leftJoin('p.likeBy', 'lb', 'WITH', 'lb = :me')
            ->setParameter('me', $currentUser)
            ->groupBy('p.id, p.content, p.likeCount, t.commentCount, p.createdAt, a.id, t.id')
            ->orderBy('p.createdAt', 'DESC')
            ->addOrderBy('p.id', 'DESC');

        if ($id) {
            $qb->andWhere('p.id = :id')
                ->setParameter('id', $id);
        }

        if ($authorId) {
            $qb->andWhere('IDENTITY(p.author) = :authorId')
                ->setParameter('authorId', $authorId);
        }

        if ($visibilities !== null && $visibilities !== []) {
            $qb->andWhere('p.visibility IN (:vis)')
                ->setParameter('vis', $visibilities);
        }

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        $results = $qb->getQuery()->getResult();
        return $results;
    }

    public function findOneById(Uuid $id): ?Post
    {
        return $this->find($id);
    }
}
