<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Schema\Exception\NotImplemented;
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

    public function getUnreadMessageCountForUserByChats(User $user, array $chatsIds): array
    {
        throw new NotImplemented();
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
}
