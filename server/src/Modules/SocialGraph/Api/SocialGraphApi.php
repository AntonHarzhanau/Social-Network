<?php

namespace App\Modules\SocialGraph\Api;

use App\Modules\SocialGraph\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use App\Modules\SocialGraph\Domain\Repository\UserBlockRepositoryInterface;
use Symfony\Component\Uid\Uuid;

class SocialGraphApi implements SocialGraphApiInterface
{
    public function __construct(
        private readonly UserBlockRepositoryInterface $userBlockRepository,
        private readonly FriendshipRepositoryInterface $friendshipRepository,
    ) {}

    /**
     * @return Uuid[]
     */
    public function getBlockedUsersIdsForUser(Uuid $currentUserId): array
    {

        return $this->userBlockRepository->getBlockedUserIdsForUser($currentUserId);
    }

    public function isUserBlockedByUser(Uuid $userId, Uuid $potentialBlockerId): bool
    {
        return $this->userBlockRepository->findOneByBlockerAndBlocked($userId, $potentialBlockerId) ? true : false;
    }

    public function getFriendsIdsForUser(Uuid $currentUserId): array
    {
        $friendsIds = $this->friendshipRepository->findUserFriends($currentUserId);
        $sentRequestIds = $this->friendshipRepository->findSentFriendRequests($currentUserId);
        $receivedRequestIds = $this->friendshipRepository->findReceivedFriendRequests($currentUserId);
        $ids = array_merge($friendsIds, $sentRequestIds, $receivedRequestIds);

        return $ids;
    }
    public function areUsersFriends(Uuid $userId, Uuid $potentialFriendId): bool
    {
        return $this->friendshipRepository->findFriendship(
            $userId,
            $potentialFriendId,
            [FriendshipStatusEnum::ACCEPTED],
        ) ? true : false;
    }

    public function getFriendsWallIdsForUser(Uuid $currentUserId): array
    {
        return $this->friendshipRepository->findFriendsWallIds($currentUserId);
    }
}
