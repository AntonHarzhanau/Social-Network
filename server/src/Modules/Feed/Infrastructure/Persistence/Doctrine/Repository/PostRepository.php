<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Application\DTO\PostRowDTO;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Feed\Domain\Entity\PostLike;
use App\Modules\Feed\Domain\Enum\PostStatusEnum;
use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
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

    public function findFeed(
        Uuid $currentUser,
        ?array $wallIds,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null,
        ?array $statuses = null,
        ?WallOwnerTypeEnum $ownerType = null,
    ): array {
        $qb = $this->baseQb($currentUser);
        if ($wallIds !== null) {
            if ($wallIds === []) {
                return [];
            }

            $qb->andWhere('w.id IN (:wallIds)')
                ->setParameter('wallIds', $wallIds);
        } else {
            $statuses ??= [PostStatusEnum::PUBLISHED];
            $visibilities ??= [VisibilityEnum::PUBLIC];
        }

        $this->applyVisibility($qb, $visibilities ?? [VisibilityEnum::PUBLIC]);
        $this->applyStatus($qb, $statuses ?? [PostStatusEnum::PUBLISHED]);
        $this->applyOwnerType($qb, $ownerType);
        $this->applyPagination($qb, $page, $limit);

        $result = $qb->getQuery()->getResult();
        return $result;
    }

    public function findByWallId(
        Uuid $currentUser,
        Uuid $wallId,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null,
        ?array $statuses = null,
    ): array {
        $qb = $this->baseQb($currentUser)
            ->andWhere('w.id = :wallId')
            ->setParameter('wallId', $wallId);

        $this->applyVisibility($qb, $visibilities);
        $this->applyStatus($qb, $statuses ?? [PostStatusEnum::PUBLISHED]);
        $this->applyPagination($qb, $page, $limit);

        return $qb->getQuery()->getResult();
    }

    public function findOnePostById(Uuid $currentUser, Uuid $postId): ?PostRowDTO
    {
        $qb = $this->baseQb($currentUser)
            ->andWhere('p.id = :postId')
            ->setParameter('postId', $postId)
            ->setMaxResults(1);

        return $qb->getQuery()->getOneOrNullResult();
    }

    private function baseQb(Uuid $currentUser): QueryBuilder
    {
        return $this->createQueryBuilder('p')
            ->join('p.wall', 'w')
            ->leftJoin(
                PostLike::class,
                'pl',
                'WITH',
                'pl.post = p AND pl.user = :currentUser'
            )
            ->join('p.commentThread', 'ct')
            ->setParameter('currentUser', $currentUser)
            ->select(
                'NEW ' . PostRowDTO::class . '(' .
                    'p.id, ' .
                    'w.id, ' .
                    'w.ownerType, ' .
                    'IDENTITY(p.author), ' .
                    'p.content, ' .
                    'IDENTITY(p.commentThread), ' .
                    'p.likeCount, ' .
                    'ct.commentCount, ' .
                    '(CASE WHEN pl.id IS NULL THEN false ELSE true END), ' .
                    'p.createdAt, ' .
                    'p.kind, ' .
                    'IDENTITY(p.originalPost), ' .
                    'p.quote' .
                    ')'
            )
            ->orderBy('p.createdAt', 'DESC')
            ->addOrderBy('p.id', 'DESC');
    }

    // --- FILTERS ---

    private function applyPagination(QueryBuilder $qb, ?int $page, ?int $limit): void
    {
        if ($page === null || $limit === null) return;
        $page = max(1, $page);
        $limit = max(1, $limit);

        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
    }

    private function applyVisibility(QueryBuilder $qb, ?array $visibilities): void
    {
        if ($visibilities === null || $visibilities === []) return;

        $qb->andWhere('p.visibility IN (:vis)')
            ->setParameter('vis', $visibilities);
    }

    private function applyStatus(QueryBuilder $qb, ?array $statuses): void
    {
        if ($statuses === null || $statuses === []) return;

        $qb->andWhere('p.status IN (:statuses)')
            ->setParameter('statuses', $statuses);
    }

    private function applyOwnerType(QueryBuilder $qb, ?WallOwnerTypeEnum $ownerType): void
    {
        if ($ownerType === null) return;

        $qb->andWhere('w.ownerType = :ownerType')
            ->setParameter('ownerType', $ownerType);
    }

    public function findOneById(Uuid $postId): ?Post
    {
        return $this->find($postId);
    }
}
