<?php

namespace App\Repository;

use App\Entity\Chat;
use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Schema\Exception\NotImplemented;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function createMessage(Chat $chat, User $sender, string $content): Message
    {
        $message = new Message();
        $message->setChat($chat);
        $message->setSender($sender);
        $message->setContent($content);
        $message->setCreatedAt(new \DateTimeImmutable());

        $this->getEntityManager()->persist($message);
        $this->getEntityManager()->flush();

        return $message;
    }

    public function getUnreadMessageCountForUserByChats(User $user, array $chatsIds): array
    {
       throw new NotImplemented();
       
    }
}
