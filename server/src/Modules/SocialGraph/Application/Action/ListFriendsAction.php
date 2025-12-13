<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Entity\User;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    /** @return User[] */
    public function execute(Uuid $currentUserId): array
    {
        $currentUser = $this->users->getUserEntityOrFail($currentUserId);
        $friendships = $this->friendships->findUserFriends($currentUser);

        return array_map(
            fn(Friendship $f) => $f->getRequester() === $currentUser ? $f->getAddressee() : $f->getRequester(),
            $friendships
        );
    }
}
