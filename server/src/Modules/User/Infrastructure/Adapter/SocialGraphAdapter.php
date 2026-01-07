<?php

namespace App\Modules\User\Infrastructure\Adapter;

use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use App\Modules\User\Application\Port\SocialGraphPort;
use Symfony\Component\Uid\Uuid;

final class SocialGraphAdapter implements SocialGraphPort
{
    public function __construct(
        private readonly SocialGraphApiInterface $socialGraphApi,
    ) {}

    /**
     * @return Uuid[]
     */
    public function getBlockedUsersIdsForUser(Uuid $currentUserId): array
    {
        return $this->socialGraphApi->getBlockedUsersIdsForUser($currentUserId);
    }

    public function isUserBlockedByUser(Uuid $userId, Uuid $potentialBlockerId): bool
    {
        return $this->socialGraphApi->isUserBlockedByUser($userId, $potentialBlockerId);
    }

    public function getFriendsIdsForUser(Uuid $currentUserId, int $page, int $limit): array
    {
        return $this->socialGraphApi->getFriendsIdsForUser($currentUserId, $page, $limit);
    }

    public function areUsersFriends(Uuid $userId, Uuid $potentialFriendId): bool
    {
        return $this->socialGraphApi->areUsersFriends($userId, $potentialFriendId);
    }
}
