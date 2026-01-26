<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use Symfony\Component\Uid\Uuid;

interface ChatRepositoryInterface
{
    public function findUserChatsWithLastMessage(
        Uuid $user,
        int $page = 1,
        int $limit = 10,
        bool $unreadOnly = false
    ): array;
    
    public function findById(Uuid $chatId): ?Chat;
    public function save(Chat $chat): void;
}
