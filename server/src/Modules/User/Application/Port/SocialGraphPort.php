<?php

namespace App\Modules\User\Application\Port;

use Symfony\Component\Uid\Uuid;

interface SocialGraphPort
{
    public function getBlockedUsersIdsForUser(Uuid $currentUserId): array;
    public function isUserBlockedByUser(Uuid $userId, Uuid $potentialBlockerId): bool;
    public function getFriendsIdsForUser(Uuid $currentUserId, int $page, int $limit): array;
    public function areUsersFriends(Uuid $userId, Uuid $potentialFriendId): bool;
}
