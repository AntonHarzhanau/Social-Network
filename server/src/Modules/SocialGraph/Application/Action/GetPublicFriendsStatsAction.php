<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\DTO\PublicFriendsStatsDTO;
use App\Modules\SocialGraph\Domain\Enum\FriendCountMode;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetPublicFriendsStatsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendsRepository,
    ) {}

    public function execute(Uuid $currentUserId): PublicFriendsStatsDTO
    {
        $friendsTotal = $this->friendsRepository->countUserFriends($currentUserId, FriendCountMode::FRIENDS);

        return new PublicFriendsStatsDTO($friendsTotal);
    }
}
