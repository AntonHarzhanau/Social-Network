<?php

namespace App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Media\Api\PostMediaApiInterface;
use App\Modules\Media\Domain\Entity\PostMediaBinding;
use App\Modules\Media\Domain\Repository\PostMediaBindingRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\AbstractQuery;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<PostMediaBindings>
 */
class PostMediaBindingRepository extends ServiceEntityRepository implements PostMediaBindingRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PostMediaBinding::class);
    }

    public function addMediaToPost(array $mediaIds, Uuid $postId): void
    {

        $post = $this->getEntityManager()->getReference('App\Modules\Feed\Domain\Entity\Post', $postId);

        foreach ($mediaIds as $mediaId) {
            $mediaId = Uuid::fromString($mediaId);
            $media = $this->getEntityManager()->getReference('App\Modules\Media\Domain\Entity\MediaAsset', $mediaId);
            $binding = new PostMediaBinding();
            $binding->setPost($post);
            $binding->setMedia($media);
            $this->getEntityManager()->persist($binding);
        }
        $this->getEntityManager()->flush();
    }

    public function removeMediaFromPost(array $mediaIds, Uuid $post): void
    {
        $qb = $this->createQueryBuilder('pmb')
            ->delete()
            ->where('pmb.post = :post')
            ->andWhere('pmb.media IN (:mediaIds)')
            ->setParameter('post', $post)
            ->setParameter('mediaIds', $mediaIds);
        $qb->getQuery()->execute();
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
