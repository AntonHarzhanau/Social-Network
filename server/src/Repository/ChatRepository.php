<?php

namespace App\Repository;

use App\Entity\Chat;
use App\Entity\User;
use App\Enum\ChatTypeEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Chat>
 */
class ChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chat::class);
    }

    public function findUserChatsWithLastMessage(
        User $user,
        int $page = 1,
        int $limit = 10
    ): array {
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('c')
 
            ->innerJoin('c.chatParticipants', 'cpCurrent', 'WITH', 'cpCurrent.user = :user')
            ->setParameter('user', $user)

     
            ->leftJoin('c.lastMessage', 'lm')
            ->leftJoin('lm.sender', 'lmSender')


            ->addSelect('PARTIAL c.{id, type, title, avatarUrl, createdAt, updatedAt}')
            ->addSelect('PARTIAL lm.{id, content, createdAt}')
            ->addSelect('PARTIAL lmSender.{id, username, avatarUrl}')

            ->orderBy('lm.createdAt', 'DESC')
            ->addOrderBy('c.createdAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

 
        $chats = $qb->getQuery()->getResult();

        // separate request for loading participants for DIRECT chats

        $this->prefetchDirectParticipants($chats);

        return $chats;
    }

    private function prefetchDirectParticipants(array $chats): void
    {
        $directChats = array_filter(
            $chats,
            fn(Chat $chat) => $chat->getType()->value === ChatTypeEnum::DIRECT->value
        );

        if (empty($directChats)) {
            return;
        }

        $ids = array_map(fn(Chat $chat) => $chat->getId(), $directChats);


        $qb = $this->createQueryBuilder('c')
            ->select('c', 'cp', 'u')
            ->innerJoin('c.chatParticipants', 'cp')
            ->innerJoin('cp.user', 'u')
            ->where('c.id IN (:ids)')
            ->setParameter('ids', $ids);

        $qb->getQuery()->getResult();
    }

}
