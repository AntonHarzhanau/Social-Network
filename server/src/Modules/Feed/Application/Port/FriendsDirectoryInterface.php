<?php

namespace App\Modules\Feed\Application\Port;

use Symfony\Component\Uid\Uuid;



interface FriendsDirectoryInterface
{
    public function findFriendWallIdsByUserId(Uuid $userId): array;
}
