<?php

namespace App\Modules\Feed\Application\DTO;

final readonly class PostLikeResponse
{
    public function __construct(
        public string $postId,
        public int $likeCount,
        public bool $isLikedByCurrentUser,
    ) {}
}
