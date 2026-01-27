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
        return parent::findBy($criteria, $orderBy, $limit, $offset)[0] ?? null;
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

    public function countUnreadChatsForUser(Uuid $userId): int
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

    public function findLatest(Uuid $chatId, int $limit): array
    {
        $rows = $this->createQueryBuilder('m')
            ->andWhere('m.chat = :chatId')
            ->setParameter('chatId', $chatId)
            ->orderBy('m.createdAt', 'DESC')
            ->addOrderBy('m.id', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return array_reverse($rows);
    }

    public function findByCursor(
        Uuid $chatId,
        \DateTimeImmutable $cursorAt,
        Uuid $cursorId,
        int $limit,
        string $mode, // before|after
    ): array {
        if (!\in_array($mode, ['before', 'after'], true)) {
            throw new \InvalidArgumentException('mode must be before|after');
        }

        $qb = $this->createQueryBuilder('m')
            ->andWhere('m.chat = :chatId')
            ->setParameter('chatId', $chatId)
            ->setMaxResults($limit);

        if ($mode === 'before') {
            $qb->andWhere('(m.createdAt < :t OR (m.createdAt = :t AND m.id < :id))')
                ->setParameter('t', $cursorAt)
                ->setParameter('id', $cursorId)
                ->orderBy('m.createdAt', 'DESC')
                ->addOrderBy('m.id', 'DESC');

            $rows = $qb->getQuery()->getResult();
            return array_reverse($rows);
        }

        $qb->andWhere('(m.createdAt > :t OR (m.createdAt = :t AND m.id > :id))')
            ->setParameter('t', $cursorAt)
            ->setParameter('id', $cursorId)
            ->orderBy('m.createdAt', 'ASC')
            ->addOrderBy('m.id', 'ASC');

        return $qb->getQuery()->getResult();
    }
}
