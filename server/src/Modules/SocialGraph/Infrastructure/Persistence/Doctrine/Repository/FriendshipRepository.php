<?php

namespace App\Modules\SocialGraph\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Entity\User;
use App\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Friendship>
 */
class FriendshipRepository extends ServiceEntityRepository implements FriendshipRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Friendship::class);
    }

    public function save(Friendship $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Friendship $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findFriendship(User $userA, User $userB, ?FriendshipStatusEnum $status = null): ?Friendship
    {
        $qb = $this->createQueryBuilder('f')
            ->where('(f.requester = :userA AND f.addressee = :userB) OR (f.requester = :userB AND f.addressee = :userA)')
            ->setParameter('userA', $userA)
            ->setParameter('userB', $userB);

        if ($status !== null) {
            $qb->andWhere('f.status = :status')
                ->setParameter('status', $status);
        }

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @return Friendship[]
     */
    public function findUserFriends(User $user): array
    {
        $qb = $this->createQueryBuilder('f')
            ->where('f.requester = :user OR f.addressee = :user')
            ->andWhere('f.status = :status')
            ->setParameter('status', FriendshipStatusEnum::ACCEPTED)
            ->setParameter('user', $user);

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Friendship[]
     */
    public function findReceivedFriendRequests(User $user): array
    {
        $qb = $this->createQueryBuilder('f')
            ->leftJoin('f.requester', 'r')
            ->addSelect('r')
            ->where('f.addressee = :user')
            ->andWhere('f.status = :status')
            ->setParameter('user', $user)
            ->setParameter('status', FriendshipStatusEnum::PENDING);

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Friendship[]
     */
    public function findSentFriendRequests(User $user): array
    {
        $qb = $this->createQueryBuilder('f')
            ->leftJoin('f.addressee', 'a')
            ->addSelect('a')
            ->where('f.requester = :user')
            ->andWhere('f.status = :status')
            ->setParameter('user', $user)
            ->setParameter('status', FriendshipStatusEnum::PENDING);

        return $qb->getQuery()->getResult();
    }
}
