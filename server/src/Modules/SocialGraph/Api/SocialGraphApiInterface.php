<?php

namespace App\Modules\SocialGraph\Api;

use Symfony\Component\Uid\Uuid;

interface SocialGraphApiInterface
{
    public function getBlockedUsersIdsForUser(Uuid $currentUserId): array;
    public function isUserBlockedByUser(Uuid $userId, Uuid $potentialBlockerId): bool;
}
