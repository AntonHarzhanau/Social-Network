<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\DTO\Post\PostWithLikeFlagDTO;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Identity\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
        ?User $author = null,
        ?string $id = null,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null
    ): array {
        $qb = $this->createQueryBuilder('p')
            ->select('NEW App\DTO\Post\PostWithLikeFlagDTO(
            p,
            CASE WHEN :currentUser MEMBER OF p.likeBy
                THEN 
                    true 
                ELSE 
                    false 
                END
            )')
            ->setParameter('currentUser', $currentUser)
            ->orderBy('p.createdAt', 'DESC')
            ->addOrderBy('p.id', 'DESC');

        if ($id) {
            $qb->andWhere('p.id = :id')
                ->setParameter('id', $id);
        }

        if ($author) {
            $qb->andWhere('p.author = :author')
                ->setParameter('author', $author);
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
}
