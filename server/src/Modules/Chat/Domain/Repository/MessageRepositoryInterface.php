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

    public function findLatest(Uuid $chatId, int $limit): array;

    public function countUnreadChatsForUser(Uuid $userId): int;

    public function findByCursor(
        Uuid $chatId,
        \DateTimeImmutable $cursorAt,
        Uuid $cursorId,
        int $limit,
        string $mode, // 'before' | 'after'
    ): array;
}
