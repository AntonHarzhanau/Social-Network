<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\DirectChatIndex;
use App\Modules\User\Domain\Entity\User;

interface DirectChatIndexRepositoryInterface
{
    public function findByUsers(User $userA, User $userB): ?DirectChatIndex;
}
