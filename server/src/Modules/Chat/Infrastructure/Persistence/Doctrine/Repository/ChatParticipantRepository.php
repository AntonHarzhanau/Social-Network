<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ChatParticipant>
 */
class ChatParticipantRepository extends ServiceEntityRepository implements ChatParticipantRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatParticipant::class);
    }

    public function findOneBy(array $criteria, array|null $orderBy = null): ?ChatParticipant
    {
        return parent::findOneBy($criteria);
    }

    public function getAllUsersByChatId(Chat $chat): array
    {
        $qb = $this->createQueryBuilder('cp')
            ->select('cp', 'u')
            ->innerJoin('cp.user', 'u')
            ->andWhere('cp.chat = :chat')
            ->setParameter('chat', $chat);

        return $qb->getQuery()->getResult();
    }

    public function findUserChatsWithLastMessage(int $userId): array
    {
        $qb = $this->createQueryBuilder('cp')
            ->select('c', 'lm', 'lmSender', 'participants', 'participantUser')
            ->distinct()
            ->innerJoin('cp.chat', 'c')
            ->leftJoin('c.lastMessage', 'lm')
            ->leftJoin('lm.sender', 'lmSender')
            ->leftJoin('c.chatParticipants', 'participants')
            ->leftJoin('participants.user', 'participantUser')
            ->andWhere('IDENTITY(cp.user) = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('lm.createdAt', 'DESC')
            ->addOrderBy('c.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    public function delete(ChatParticipant $chatParticipant): void
    {
        $em = $this->getEntityManager();
        $em->remove($chatParticipant);
        $em->flush();
    }
}
