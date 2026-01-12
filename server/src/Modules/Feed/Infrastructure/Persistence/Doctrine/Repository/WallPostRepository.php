<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Application\DTO\WallPostFeedRowDTO;
use App\Modules\Feed\Domain\Entity\WallPost;
use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use App\Modules\Feed\Domain\Repository\WallPostRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

final class WallPostRepository extends ServiceEntityRepository implements WallPostRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WallPost::class);
    }

    public function save(WallPost $wallPost, bool $flush = true): void
    {
        $this->getEntityManager()->persist($wallPost);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(WallPost $wallPost, bool $flush = true): void
    {
        $this->getEntityManager()->remove($wallPost);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }


    /**
     * Posts from a specific wall (profile/group).
     * $wallId = user.wall.id or group.wall.id
     */
    public function findWallFeed(
        Uuid $currentUser,
        Uuid $wallId,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null
    ): array {
        $qb = $this->baseFeedQb($currentUser)
            ->andWhere('IDENTITY(wp.wall) = :wallId')
            ->setParameter('wallId', $wallId);

        if ($visibilities !== null && $visibilities !== []) {
            $qb->andWhere('p.visibility IN (:vis)')
                ->setParameter('vis', $visibilities);
        }

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Mixed Feed: a set of walls + (optional) public posts.
     * $wallIds: [myWallId, friendsWallIds..., subscribedGroupWallIds...]
     */
    public function findMixedFeed(
        Uuid $currentUser,
        array $wallIds,
        ?int $page = null,
        ?int $limit = null,
        bool $includePublicAlso = true
    ): array {
        $qb = $this->baseFeedQb($currentUser);

        if ($wallIds === []) {
            $qb->andWhere('1 = 0');
        } else {
            $qb->andWhere('IDENTITY(wp.wall) IN (:wallIds)')
                ->setParameter('wallIds', $wallIds);
        }

        if ($includePublicAlso) {
            $qb->orWhere('p.visibility = :publicVis')
                ->setParameter('publicVis', VisibilityEnum::PUBLIC);
        }

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }
        $result = $qb->getQuery()->getResult();

        return $result;
    }

    public function findPostsByIds(Uuid $currentUserId, Uuid $postId): ?WallPostFeedRowDTO
    {
        $qb = $this->baseFeedQb($currentUserId)
            ->andWhere('p.id = :postId')
            ->setParameter('postId', $postId);

        return $qb->getQuery()->getOneOrNullResult();
    }

    private function baseFeedQb(Uuid $currentUserId)
    {
        return $this->createQueryBuilder('wp')
            ->select(sprintf(
                'NEW %s(
                    wp.id,
                    wp.createdAt,
                    p.id,
                    p.content,
                    p.likeCount,
                    t.commentCount,
                    CASE WHEN COUNT(lb) > 0 THEN true ELSE false END,
                    a.id,
                    act.id,
                    w.id,
                    wp.kind,
                    wp.quote,
                    t.id
                )',
                WallPostFeedRowDTO::class
            ))
            ->join('wp.post', 'p')
            ->join('p.author', 'a')
            ->leftJoin('wp.actor', 'act')
            ->join('wp.wall', 'w')
            ->innerJoin('p.commentThread', 't')
            ->leftJoin('p.likeBy', 'lb', 'WITH', 'lb = :me')
            ->setParameter('me', $currentUserId)
            ->groupBy('wp.id, wp.createdAt, p.id, p.content, p.likeCount, t.commentCount, a.id, act.id, w.id, wp.kind, wp.quote, t.id')
            ->orderBy('wp.createdAt', 'DESC')
            ->addOrderBy('wp.id', 'DESC');
    }
}
