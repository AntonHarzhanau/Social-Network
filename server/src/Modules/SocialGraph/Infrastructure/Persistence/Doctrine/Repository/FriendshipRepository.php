<?php

namespace App\Modules\SocialGraph\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\SocialGraph\Domain\Enum\FriendCountMode;
use App\Modules\SocialGraph\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Friendship>
 */
final class FriendshipRepository extends ServiceEntityRepository implements FriendshipRepositoryInterface
{
    /**
     * DQL expression to compute "other user id" relative to :user
     */
    private const OTHER_ID_EXPR =
        'CASE WHEN IDENTITY(f.requester) = :user THEN IDENTITY(f.addressee) ELSE IDENTITY(f.requester) END';

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


    /**
     * @return list<string> wall ids of accepted friends
     */
    public function findFriendsWallIds(
        Uuid $userId,
        ?int $page = null,
        ?int $limit = null,
        ?string $search = null
    ): array {
        $qb = $this->qbUserRelationsBase($userId);

        $this->applyStatus($qb, FriendshipStatusEnum::ACCEPTED);
        $this->applySearchByOtherUserName($qb, $search);
        $this->applyPagination($qb, $page, $limit);

        $qb->select(
            'CASE
            WHEN IDENTITY(f.requester) = :user THEN IDENTITY(addr.wall)
            ELSE IDENTITY(req.wall)
        END AS wallId'
        );

        $rows = $qb->getQuery()->getScalarResult();

        return array_map(static fn(array $r) => (string) $r['wallId'], $rows);
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
                (IDENTITY(f.requester) = :userA AND IDENTITY(f.addressee) = :userB)
                OR
                (IDENTITY(f.requester) = :userB AND IDENTITY(f.addressee) = :userA)
            ')
            ->setParameter('userA', $userAId)
            ->setParameter('userB', $userBId);

        if ($status !== null) {
            $qb->andWhere('f.status IN (:status)')
                ->setParameter('status', $status);
        }

        $this->applyPagination($qb, $page, $limit);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @return list<string> friend user ids
     */
    public function findUserFriends(
        Uuid $user,
        ?int $page = null,
        ?int $limit = null,
        ?string $search = null
    ): array {
        $qb = $this->qbUserRelationsBase($user);

        $this->applyStatus($qb, FriendshipStatusEnum::ACCEPTED);
        $this->applySearchByOtherUserName($qb, $search);
        $this->applyPagination($qb, $page, $limit);

        $qb->select(self::OTHER_ID_EXPR . ' AS friendId');

        $rows = $qb->getQuery()->getScalarResult();
        return array_map(static fn(array $r) => (string) $r['friendId'], $rows);
    }

    /**
     * @return list<string> requester ids
     */
    public function findReceivedFriendRequests(
        Uuid $userId,
        ?int $page = null,
        ?int $limit = null,
        ?string $search = null
    ): array {
        $qb = $this->qbUserRelationsBase($userId);

        $this->applyIncoming($qb);
        $this->applyStatus($qb, FriendshipStatusEnum::PENDING);
        $this->applySearchByOtherUserName($qb, $search);
        $this->applyPagination($qb, $page, $limit);

        $qb->select(self::OTHER_ID_EXPR . ' AS requesterId');

        $rows = $qb->getQuery()->getScalarResult();
        return array_map(static fn(array $r) => (string) $r['requesterId'], $rows);
    }

    /**
     * @return list<string> addressee ids
     */
    public function findSentFriendRequests(
        Uuid $userId,
        ?int $page = null,
        ?int $limit = null,
        ?string $search = null
    ): array {
        $qb = $this->qbUserRelationsBase($userId);

        $this->applyOutgoing($qb);
        $this->applyStatus($qb, FriendshipStatusEnum::PENDING);
        $this->applySearchByOtherUserName($qb, $search);
        $this->applyPagination($qb, $page, $limit);

        $qb->select(self::OTHER_ID_EXPR . ' AS addresseeId');

        $rows = $qb->getQuery()->getScalarResult();
        return array_map(static fn(array $r) => (string) $r['addresseeId'], $rows);
    }

    public function countUserFriends(
        Uuid $userId,
        FriendCountMode $mode = FriendCountMode::FRIENDS
    ): int {
        $qb = $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->setParameter('user', $userId);

        switch ($mode) {
            case FriendCountMode::FRIENDS:
                $qb->where(
                    $qb->expr()->orX(
                        'IDENTITY(f.requester) = :user',
                        'IDENTITY(f.addressee) = :user'
                    )
                )
                    ->andWhere('f.status = :status')
                    ->setParameter('status', FriendshipStatusEnum::ACCEPTED);
                break;

            case FriendCountMode::INCOMING_REQUESTS:
                $qb->where('IDENTITY(f.addressee) = :user')
                    ->andWhere('f.status = :status')
                    ->setParameter('status', FriendshipStatusEnum::PENDING);
                break;

            case FriendCountMode::OUTGOING_REQUESTS:
                $qb->where('IDENTITY(f.requester) = :user')
                    ->andWhere('f.status = :status')
                    ->setParameter('status', FriendshipStatusEnum::PENDING);
                break;
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    // Base QB 
    private function qbUserRelationsBase(Uuid $userId): QueryBuilder
    {
        return $this->createQueryBuilder('f')
            ->setParameter('user', $userId)
            ->andWhere('IDENTITY(f.requester) = :user OR IDENTITY(f.addressee) = :user')
            ->leftJoin('f.requester', 'req')
            ->leftJoin('f.addressee', 'addr')
            ->orderBy('f.createdAt', 'ASC')
            ->addOrderBy('f.id', 'ASC');
    }

    private function applyStatus(QueryBuilder $qb, FriendshipStatusEnum $status): void
    {
        $qb->andWhere('f.status = :status')
            ->setParameter('status', $status);
    }

    private function applyIncoming(QueryBuilder $qb): void
    {
        $qb->andWhere('IDENTITY(f.addressee) = :user');
    }

    private function applyOutgoing(QueryBuilder $qb): void
    {
        $qb->andWhere('IDENTITY(f.requester) = :user');
    }

    private function applySearchByOtherUserName(QueryBuilder $qb, ?string $search): void
    {
        $q = $search !== null ? trim($search) : '';
        if ($q === '') {
            return;
        }

        $qb->andWhere(
            $qb->expr()->orX(
                $qb->expr()->andX('IDENTITY(f.requester) = :user', 'LOWER(addr.username) LIKE :q'),
                $qb->expr()->andX('IDENTITY(f.addressee) = :user', 'LOWER(req.username) LIKE :q')
            )
        )->setParameter('q', '%' . mb_strtolower($q) . '%');
    }

    private function applyPagination(QueryBuilder $qb, ?int $page, ?int $limit): void
    {
        if ($page === null || $limit === null) {
            return;
        }

        $page = max(1, $page);
        $limit = max(1, $limit);

        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
    }

}
