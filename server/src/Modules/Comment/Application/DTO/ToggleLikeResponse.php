<?php

namespace App\Modules\Comment\Application\DTO;

final readonly class ToggleLikeResponse
{
    public function __construct(
        public string $commentId,
        public int $likeCount,
        public bool $isLikedByCurrentUser,
    ) {}
}
