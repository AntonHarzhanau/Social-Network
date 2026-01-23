<?php

namespace App\Modules\SocialGraph\Application\DTO;

final readonly class PublicFriendsStatsDTO
{
    public function __construct(
        public int $friendsTotal,
    ) {
    }
}
