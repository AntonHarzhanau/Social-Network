<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
    ) {}

    /** @return User[] */
    public function execute(Uuid $currentUserId): array
    {
        $friendIds = $this->friendships->findUserFriends($currentUserId);
        return $friendIds;
    }
}
