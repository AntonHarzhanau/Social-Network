<?php

namespace App\DTO\Post;

final readonly class PostLikeResponseDTO
{
    public function __construct(
        public string $postId,
        public int $likeCount,
        public bool $isLikedByCurrentUser,
    ) {}
}
