<?php

namespace App\DTO\Post;

use App\Entity\Post;

final class PostWithLikeFlagDTO
{
    public function __construct(
        public Post $post,
        public bool $likedByCurrentUser,
    ) {}
}
