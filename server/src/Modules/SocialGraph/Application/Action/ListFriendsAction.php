<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    /** @return UserPreview[] */
    public function execute(Uuid $currentUserId): array
    {
        $friendIds = $this->friendships->findUserFriends($currentUserId);

        $previews = $this->users->findPreviewsByIds($friendIds);
        return $previews;
    }
}
