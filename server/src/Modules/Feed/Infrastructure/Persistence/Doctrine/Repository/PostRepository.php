<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\DTO\Post\PostWithLikeFlagDTO;
use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
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
        $qb = $this->createQueryBuilder('p')->select(sprintf(
            'NEW %s(
            p.id,
            p.content,
            p.likeCount,
            p.commentCount,
            CASE WHEN :me MEMBER OF p.likeBy THEN true ELSE false END,
            p.createdAt,
            NEW %s(a.id, a.username, a.avatarUrl, a.slug)
        )',
            PostFeedItem::class,
            UserPreviewDTO::class
        ))
            ->join('p.author', 'a')
            ->setParameter('me', $currentUser)
            ->orderBy('p.createdAt', 'DESC')
            ->addOrderBy('p.id', 'DESC');

        if ($id) {
            $qb->andWhere('p.id = :id')
                ->setParameter('id', $id);
        }

        if ($authorId) {
            $qb->andWhere('p.author = :authorId')
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

        /** @var PostWithLikeFlagDTO[] $results */
        $results = $qb->getQuery()->getResult();
        return $results;
    }

    public function findOneById(Uuid $id): ?Post
    {
        return $this->find($id);
    }
}
