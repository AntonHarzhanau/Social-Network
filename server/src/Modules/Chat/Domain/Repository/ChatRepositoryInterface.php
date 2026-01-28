<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Application\DTO\ChatListItemRowDTO;
use App\Modules\Chat\Domain\Entity\Chat;
use Symfony\Component\Uid\Uuid;

interface ChatRepositoryInterface
{
    public function findUserChatsWithLastMessage(
        Uuid $userId,
        int $page = 1,
        int $limit = 10,
        bool $unreadOnly = false
    ): array;

    public function findUserChatRowById(Uuid $userId, Uuid $chatId): ?ChatListItemRowDTO;

    public function findById(Uuid $chatId): ?Chat;
    public function delete(Chat $chat): void;
    public function save(Chat $chat): void;
}
