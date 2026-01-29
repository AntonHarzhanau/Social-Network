<?php

namespace App\Modules\Notification\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Notification\Application\DTO\NotificationRawDTO;
use App\Modules\Notification\Domain\Entity\Notification;
use App\Modules\Notification\Domain\Enum\NotificationTypeEnum;
use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;


/**
 * @extends ServiceEntityRepository<Notification>
 */
class NotificationRepository extends ServiceEntityRepository implements NotificationRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    public function save(Notification $notification, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($notification);
        if ($flush) {
            $em->flush();
        }
    }

    public function remove(Notification $notification, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->remove($notification);
        if ($flush) {
            $em->flush();
        }
    }

    public function countUnread(Uuid $recipientId): int
    {
        $qb = $this->createQueryBuilder('n');

        $qb->select('COUNT(n.id)')
            ->where('IDENTITY(n.recipient) = :recipientId')
            ->setParameter('recipientId', $recipientId);

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function findByRecipientId(Uuid $recipientId, int $page = 1, int $limit = 20): array
    {
        $qb = $this->createQueryBuilder('n')
            ->join('n.recipient', 'r')
            ->select(\sprintf('NEW %s(n.id, n.type, n.text, n.payload, n.createdAt)', NotificationRawDTO::class))
            ->where('IDENTITY(n.recipient) = :recipientId')
            ->setParameter('recipientId', $recipientId)
            ->orderBy('n.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }
    public function findById(Uuid $notificationId): ?Notification
    {
        return $this->find($notificationId);
    }

    public function findAllByRecipientId(Uuid $recipientId): array
    {
        $qb = $this->createQueryBuilder('n')
            ->where('IDENTITY(n.recipient) = :recipientId')
            ->setParameter('recipientId', $recipientId);

        return $qb->getQuery()->getResult();
    }

    public function findGroupedForRecipient(
        Uuid $recipientId,
        NotificationTypeEnum $type,
        string $groupKey
    ): ?Notification {
        $qb = $this->createQueryBuilder('n')
            ->where('IDENTITY(n.recipient) = :recipientId')
            ->andWhere('n.type = :type')
            ->andWhere('n.groupKey = :groupKey')
            ->setParameter('recipientId', $recipientId)
            ->setParameter('type', $type->value)
            ->setParameter('groupKey', $groupKey)
            ->setMaxResults(1);

        /** @var Notification|null */
        return $qb->getQuery()->getOneOrNullResult();
    }

    /** @return array<string, Notification> map[recipientId] = notification */
    public function findGroupedForRecipients(
        array $recipientIds,
        NotificationTypeEnum $type,
        string $groupKey,
    ): array {
        $qb = $this->createQueryBuilder('n')
            ->join('n.recipient', 'r')
            ->where('r.id IN (:recipientIds)')
            ->andWhere('n.type = :type')
            ->andWhere('n.groupKey = :groupKey')
            ->setParameter('recipientIds', $recipientIds)
            ->setParameter('type', $type)
            ->setParameter('groupKey', $groupKey);

        /** @var Notification[] $notifications */
        $notifications = $qb->getQuery()->getResult();

        $result = [];
        foreach ($notifications as $notification) {
            $rid = $notification->getRecipient()->getId()->toRfc4122();
            $result[$rid] = $notification;
        }

        return $result;
    }

    /** @return array<string,int> map[recipientId] = unreadCount */
    public function countUnreadByRecipients(array $recipientIds): array
    {
        $qb = $this->createQueryBuilder('n')
            ->join('n.recipient', 'r')
            ->select('r.id AS recipientId, COUNT(n.id) AS unreadCount')
            ->where('r.id IN (:recipientIds)')
            ->setParameter('recipientIds', $recipientIds)
            ->groupBy('r.id');

        $rows = $qb->getQuery()->getArrayResult();

        $counts = [];
        foreach ($rows as $row) {
            $counts[(string) $row['recipientId']] = (int) $row['unreadCount'];
        }

        return $counts;
    }


}
