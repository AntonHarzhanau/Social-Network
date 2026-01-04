<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

interface MessageRepositoryInterface
{
    public function save(Message $message): Message;

    public function delete(Message $message): void;

    public function getUnreadMessageCountForUserByChats(User $user, array $chatsIds): array;

    public function findBy(
        array $criteria,
        ?array $orderBy = null,
        ?int $limit = null,
        ?int $offset = null
    ): array; 
    
    /** @return Message[] */
    public function findMessagesByChatBefore(
        Uuid $chatId,
        int $limit,
        ?\DateTimeImmutable $before = null
    ): array;
}
