<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\Identity\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Schema\Exception\NotImplemented;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository implements MessageRepositoryInterface
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
