<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Application\DTO\ChatListItemRowDTO;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Chat>
 */
class ChatRepository extends ServiceEntityRepository implements ChatRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chat::class);
    }

    public function delete(Chat $chat): void
    {
        $em = $this->getEntityManager();
        $em->remove($chat);
        $em->flush();
    }

    public function findUserChatsWithLastMessage(
        Uuid $userId,
        int $page = 1,
        int $limit = 10,
        bool $unreadOnly = false
    ): array {
        $page = max(1, $page);
        $limit = max(1, $limit);
        $offset = ($page - 1) * $limit;

        $qb = $this->qbUserChatsRow($userId)
            ->orderBy('sortDate', 'DESC')
            ->addOrderBy('c.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($unreadOnly) {
            $this->applyUnreadOnlyFilter($qb, $userId);
        }

        return $qb->getQuery()->getResult();
    }

    public function findUserChatRowById(
        Uuid $userId,
        Uuid $chatId
    ): ?ChatListItemRowDTO {
        $qb = $this->qbUserChatsRow($userId)
            ->andWhere('c.id = :chatId')
            ->setParameter('chatId', $chatId)
            ->setMaxResults(1);

        /** @var ChatListItemRowDTO|null */
        return $qb->getQuery()->getOneOrNullResult();
    }

    public function save(Chat $chat): void
    {
        $em = $this->getEntityManager();
        $em->persist($chat);
        $em->flush();
    }

    public function findById(Uuid $chatId): ?Chat
    {
        return $this->find($chatId);
    }

    private function qbUserChatsRow(Uuid $userId): QueryBuilder
    {
        $qb = $this->createQueryBuilder('c')
            ->innerJoin(
                'c.chatParticipants',
                'cpCurrent',
                'WITH',
                'cpCurrent.user = :user AND cpCurrent.deletedAt IS NULL'
            )
            ->leftJoin('c.lastMessage', 'lm')
            ->leftJoin(
                'c.chatParticipants',
                'cpOther',
                'WITH',
                'c.type = :directType AND cpOther.user != :user'
            )
            ->setParameter('user', $userId)
            ->setParameter('directType', ChatTypeEnum::DIRECT->value)
            ->select(\sprintf(
                'NEW %s(
                    c.id,
                    c.type,
                    c.title,
                    c.avatarUrl,
                    c.createdAt,
                    c.updatedAt,

                    IDENTITY(cpCurrent.lastReadMessage),
                    cpCurrent.lastReadAt,
                    cpCurrent.role,
                    cpCurrent.isMuted,

                    lm.id,
                    lm.content,
                    lm.createdAt,
                    IDENTITY(lm.sender),

                    IDENTITY(cpOther.user),
                    IDENTITY(cpOther.lastReadMessage),
                    cpOther.lastReadAt
                )',
                ChatListItemRowDTO::class
            ))
            ->addSelect('COALESCE(lm.createdAt, c.createdAt) AS HIDDEN sortDate');

        return $qb;
    }

    private function applyUnreadOnlyFilter(QueryBuilder $qb, Uuid $userId): void
    {
        $qb->andWhere('lm.id IS NOT NULL')
            ->andWhere('(cpCurrent.lastReadAt IS NULL OR cpCurrent.lastReadAt < lm.createdAt)')
            ->andWhere('IDENTITY(lm.sender) != :user')
            ->setParameter('user', $userId);
    }

}
