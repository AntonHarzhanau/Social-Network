<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Application\DTO\ChatListItemRowDTO;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

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

    public function findUserChatsWithLastMessage(
        Uuid $userId,
        int $page = 1,
        int $limit = 10,
        bool $unreadOnly = false
    ): array {
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('c')
            ->innerJoin('c.chatParticipants', 'cpCurrent', 'WITH', 'cpCurrent.user = :user')
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

                lm.id,
                lm.content,
                lm.createdAt,
                IDENTITY(lm.sender),

                IDENTITY(cpOther.user)
            )',
                ChatListItemRowDTO::class
            ))
            ->addSelect('COALESCE(lm.createdAt, c.createdAt) AS HIDDEN sortDate')
            ->orderBy('sortDate', 'DESC')
            ->addOrderBy('c.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($unreadOnly) {
            $qb->andWhere('lm.id IS NOT NULL')
                ->andWhere('(cpCurrent.lastReadAt IS NULL OR cpCurrent.lastReadAt < lm.createdAt)')
                ->andWhere('lm.sender != :user');
        }
        $result = $qb->getQuery()->getResult();

        return $result;
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

}
