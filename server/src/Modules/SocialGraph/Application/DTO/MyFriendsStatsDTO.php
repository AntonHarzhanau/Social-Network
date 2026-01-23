<?php

namespace App\Modules\SocialGraph\Application\DTO;

final readonly class MyFriendsStatsDTO
{
    public function __construct(
        public int $total,
        public int $sentRequests,
        public int $receivedRequests,
    ) {
    }
}
