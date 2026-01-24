<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\Message;
use Symfony\Component\Uid\Uuid;

interface MessageRepositoryInterface
{
    public function save(Message $message): Message;

    public function delete(Message $message): void;

    public function getUnreadMessageCountForUserByChats(Uuid $user, array $chatsIds): array;

    public function findOneBy(
        array $criteria,
        ?array $orderBy = null,
        ?int $limit = null,
        ?int $offset = null
    ): ?Message;

    /** @return Message[] */
    public function findMessagesByChatBefore(
        Uuid $chatId,
        int $limit,
        ?\DateTimeImmutable $before = null
    ): array;

    public function countUnreaChatsForUser(Uuid $userId): int;
}
