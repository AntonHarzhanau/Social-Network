<?php

namespace App\Modules\SocialGraph\Application\DTO;

final readonly class FriendListResponseDTO
{
    /**
     * @param UserPreview[] $friends
     */
    public function __construct(
        public array $friends,
        public int $totalCount,
    ) {}
}
