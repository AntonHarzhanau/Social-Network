<?php

namespace App\Modules\Notification\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Notification\Domain\Entity\Notification;
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
        return $this->createQueryBuilder('n')
            ->where('IDENTITY(n.recipient) = :recipientId')
            ->setParameter('recipientId', $recipientId)
            ->orderBy('n.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
    public function findById(Uuid $notificationId): ?Notification
    {
        return $this->find($notificationId);
    }

    public function findAllByRecipientId(Uuid $recipientId): array
    {
        return $this->createQueryBuilder('n')
            ->where('IDENTITY(n.recipient) = :recipientId')
            ->setParameter('recipientId', $recipientId)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
