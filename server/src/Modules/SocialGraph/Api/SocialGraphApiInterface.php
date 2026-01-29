<?php

namespace App\Modules\SocialGraph\Api;

use Symfony\Component\Uid\Uuid;

interface SocialGraphApiInterface
{
    public function getBlockedUsersIdsForUser(Uuid $currentUserId): array;
    public function isUserBlockedByUser(Uuid $userId, Uuid $potentialBlockerId): bool;
    public function getFriendsIdsForUser(Uuid $currentUserId): array;
    public function areUsersFriends(Uuid $userId, Uuid $potentialFriendId): bool;

    public function getFriendsWallIdsForUser(Uuid $currentUserId): array;
}
