<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\User\Domain\Entity\User;

interface ChatRepositoryInterface
{
    public function findUserChatsWithLastMessage(
        User $user,
        int $page = 1,
        int $limit = 10
    ): array;

    public function save(Chat $chat): void;
}
