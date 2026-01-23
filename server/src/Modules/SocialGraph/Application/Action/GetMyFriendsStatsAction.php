<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\DTO\MyFriendsStatsDTO;
use App\Modules\SocialGraph\Domain\Enum\FriendCountMode;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetMyFriendsStatsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendsRepository,
    ) {}

    public function execute(Uuid $currentUserId): MyFriendsStatsDTO
    {
        $friendsTotal = $this->friendsRepository->countUserFriends($currentUserId, FriendCountMode::FRIENDS);
        $sent = $this->friendsRepository->countUserFriends($currentUserId, FriendCountMode::OUTGOING_REQUESTS);
        $received = $this->friendsRepository->countUserFriends($currentUserId, FriendCountMode::INCOMING_REQUESTS);

        return new MyFriendsStatsDTO($friendsTotal, $sent, $received);
    }
}
