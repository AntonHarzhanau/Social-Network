<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Identity\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

use Doctrine\Persistence\ManagerRegistry;

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

        return $chats;
    }

}
