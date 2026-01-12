<?php

namespace App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Feed\Domain\Entity\PostMediaBinding;
use App\Modules\Feed\Domain\Repository\PostMediaBindingRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PostMediaBindings>
 */
class PostMediaBindingRepository extends ServiceEntityRepository implements PostMediaBindingRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PostMediaBinding::class);
    }
    public function save(PostMediaBinding $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }


    /** @return list<PostMediaBinding> */
    public function findBindingRowsByPostIds(array $postIds): array
    {
        if ($postIds === []) return [];

        return $this->createQueryBuilder('b')
            ->select('IDENTITY(b.post) AS postId, IDENTITY(b.media) AS mediaId')
            ->where('IDENTITY(b.post) IN (:postIds)')
            ->setParameter('postIds', $postIds)
            ->orderBy('b.createdAt', 'ASC')
            ->addOrderBy('b.id', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }
}
