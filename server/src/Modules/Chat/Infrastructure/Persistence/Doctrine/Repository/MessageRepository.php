<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository implements MessageRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function save(Message $message): Message
    {
        $this->getEntityManager()->persist($message);
        $this->getEntityManager()->flush();

        return $message;
    }

    public function delete(Message $message): void
    {
        $this->getEntityManager()->remove($message);
        $this->getEntityManager()->flush();
    }

    public function findOneBy(
        array $criteria,
        ?array $orderBy = null,
        ?int $limit = null,
        ?int $offset = null
    ): ?Message {
        return parent::findOneBy($criteria, $orderBy);
    }
  

    public function getUnreadMessageCountForUserByChats(Uuid $userId, array $chatIds): array
    {
        if (empty($chatIds)) {
            return [];
        }

        $qb = $this->createQueryBuilder('m')
            ->select('IDENTITY(m.chat) AS chatId')
            ->addSelect('COUNT(m.id) AS unreadCount')
            ->innerJoin('m.chat', 'c')
            ->innerJoin('c.chatParticipants', 'cp', 'WITH', 'IDENTITY(cp.user) = :userId')
            ->andWhere('c.id IN (:chatIds)')
            ->andWhere('IDENTITY(m.sender) <> :userId')
            ->andWhere('m.createdAt > COALESCE(cp.lastReadAt, cp.joinedAt)')
            ->setParameter('userId', $userId)
            ->setParameter('chatIds', $chatIds)
            ->groupBy('m.chat');

        $rows = $qb->getQuery()->getArrayResult();

        $result = [];
        foreach ($rows as $row) {
            $result[(string) $row['chatId']] = (int) $row['unreadCount'];
        }
        return $result;
    }

    public function findMessagesByChatBefore(
        Uuid $chatId,
        int $limit,
        ?\DateTimeImmutable $before = null
    ): array {
        $qb = $this->createQueryBuilder('m')
            ->andWhere('m.chat = :chatId')
            ->setParameter('chatId', $chatId)
            ->orderBy('m.createdAt', 'DESC')
            ->addOrderBy('m.id', 'DESC')
            ->setMaxResults($limit);

        if ($before !== null) {
            $qb->andWhere('m.createdAt < :before')
                ->setParameter('before', $before);
        }

        return $qb->getQuery()->getResult();
    }

    public function countUnreaChatsForUser(Uuid $userId): int
    {
        $qb = $this->createQueryBuilder('m')
        ->select('COUNT(DISTINCT c.id) AS unreadChatsCount')
        ->innerJoin('m.chat', 'c')
        ->innerJoin('c.chatParticipants', 'cp', 'WITH', 'IDENTITY(cp.user) = :userId')
        ->andWhere('IDENTITY(m.sender) <> :userId')
        ->andWhere('m.createdAt > COALESCE(cp.lastReadAt, cp.joinedAt)')
        ->setParameter('userId', $userId);

        return (int) $qb->getQuery()->getSingleScalarResult();
    }
}
