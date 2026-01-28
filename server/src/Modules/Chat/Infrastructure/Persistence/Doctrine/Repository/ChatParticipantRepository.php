<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<ChatParticipant>
 */
class ChatParticipantRepository extends ServiceEntityRepository implements ChatParticipantRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatParticipant::class);
    }

    public function save(ChatParticipant $chatParticipant, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($chatParticipant);
        if ($flush) {
            $em->flush();
        }
    }

    public function findOneBy(array $criteria, array|null $orderBy = null): ?ChatParticipant
    {
        return parent::findOneBy($criteria);
    }

    public function findAllUsersIdByChatId(
        Uuid $chatId,
        ?int $page = null,
        ?int $limit = null,
        ?bool $includeDeleted = false,
        ?string $search = null
    ): array {
        $qb = $this->createQueryBuilder('cp')
            ->select('u.id AS userId', 'cp.role AS role')
            ->innerJoin('cp.user', 'u')
            ->andWhere('cp.chat = :chat');

        if (!$includeDeleted) {
            $qb->andWhere('cp.deletedAt IS NULL');
        }

        $q = $search !== null ? trim($search) : '';
        if ($q !== '') {
            $qb->andWhere('LOWER(u.username) LIKE :q')
                ->setParameter('q', '%' . mb_strtolower($q) . '%');
        }

        $qb->setParameter('chat', $chatId);

        if ($page !== null && $limit !== null) {
            $qb->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        return $qb->getQuery()->getScalarResult();
    }

    public function findUserChatsWithLastMessage(Uuid $userId): array
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
