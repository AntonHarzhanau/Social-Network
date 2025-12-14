<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Identity\Domain\Entity\User;

interface ChatRepositoryInterface
{
    
    public function findUserChatsWithLastMessage(
        User $user,
        int $page = 1,
        int $limit = 10
    ): array;
}
