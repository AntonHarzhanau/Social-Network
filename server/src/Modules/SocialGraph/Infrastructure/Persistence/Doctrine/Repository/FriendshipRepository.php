<?php

namespace App\Modules\SocialGraph\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\SocialGraph\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

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

    public function findFriendship(
        Uuid $userAId,
        Uuid $userBId,
        ?array $status = null,
        ?int $page = null,
        ?int $limit = null,
    ): ?Friendship {
        $qb = $this->createQueryBuilder('f')
            ->where('
            IDENTITY(f.requester) = :userA AND IDENTITY(f.addressee) = :userB 
            OR IDENTITY(f.requester) = :userB AND IDENTITY(f.addressee) = :userA
            ')
            ->setParameter('userA', $userAId)
            ->setParameter('userB', $userBId);

        if ($status !== null) {
            $qb->andWhere('f.status IN (:status)')
                ->setParameter('status', $status);
        }
        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }
        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @return list<string>
     */
    public function findUserFriends(Uuid $user, ?int $page = null, ?int $limit = null): array
    {
        $qb = $this->createQueryBuilder('f')
            ->select('Case 
                When IDENTITY(f.requester) = :user 
                Then IDENTITY(f.addressee) 
                Else IDENTITY(f.requester)
                End as friendId')
            ->where('IDENTITY(f.requester) = :user OR IDENTITY(f.addressee) = :user')
            ->andWhere('f.status = :status')
            ->setParameter('status', FriendshipStatusEnum::ACCEPTED)
            ->setParameter('user', $user)
            ->orderBy('f.createdAt', 'ASC')
            ->addOrderBy('f.id', 'ASC');

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return list<string>
     */
    public function findReceivedFriendRequests(Uuid $userId, ?int $page = null, ?int $limit = null): array
    {
        $qb = $this->createQueryBuilder('f')
            ->select('IDENTITY(f.requester) AS requesterId')
            ->where('IDENTITY(f.addressee) = :user')
            ->andWhere('f.status = :status')
            ->setParameter('user', $userId)
            ->setParameter('status', FriendshipStatusEnum::PENDING)
            ->orderBy('f.createdAt', 'ASC')
            ->addOrderBy('f.id', 'ASC')
        ;

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Friendship[]
     */
    public function findSentFriendRequests(Uuid $userId, ?int $page = null, ?int $limit = null): array
    {
        $qb = $this->createQueryBuilder('f')
            ->select('IDENTITY(f.addressee) AS addresseeId')
            ->where('IDENTITY(f.requester) = :user')
            ->andWhere('f.status = :status')
            ->setParameter('user', $userId)
            ->setParameter('status', FriendshipStatusEnum::PENDING)
            ->orderBy('f.createdAt', 'ASC')
            ->addOrderBy('f.id', 'ASC')
        ;

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }
}
