<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
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

    public function getAllPosts(int $page, int $limit, array $visibilities): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->andWhere('p.visibility IN (:vis)')
            ->setParameter('vis', $visibilities)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findLikedPostIdsByUser(User $user, array $posts): array
    {
        $ids = array_map(fn(Post $post) => $post->getId(), $posts);

        $rows = $this->createQueryBuilder('p')
            ->select('DISTINCT p.id AS id')
            ->join('p.likeBy', 'u')
            ->andWhere('u = :user')
            ->andWhere('p.id IN (:ids)')
            ->setParameter('user', $user)
            ->setParameter('ids', $ids)
            ->getQuery()
            ->getArrayResult();

        return array_map(fn(array $row) => $row['id'], $rows);
    }
}
