<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\UserAvatar;
use App\Modules\User\Domain\Repository\UserAvatarRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<UserAvatar>
 */
class UserAvatarRepository extends ServiceEntityRepository implements UserAvatarRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserAvatar::class);
    }

    public function save(UserAvatar $avatar, bool $flush = true): void
    {
        $this->getEntityManager()->persist($avatar);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(UserAvatar $avatar, bool $flush = true): void
    {
        $this->getEntityManager()->remove($avatar);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findManyByOwnerId(Uuid $ownerId): ?array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.user = :ownerId')
            ->setParameter('ownerId', $ownerId)
            ->orderBy('a.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

}
