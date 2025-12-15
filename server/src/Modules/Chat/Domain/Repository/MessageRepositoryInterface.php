<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Identity\Domain\Entity\User;

interface MessageRepositoryInterface
{
    public function createMessage(Chat $chat, User $sender, string $content): Message;

    public function getUnreadMessageCountForUserByChats(User $user, array $chatsIds): array;

    public function findBy(array $criteria, ?array $orderBy = null, ?int $limit = null, ?int $offset = null): array;

}
