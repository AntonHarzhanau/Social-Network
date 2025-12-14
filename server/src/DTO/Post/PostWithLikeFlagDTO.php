<?php

namespace App\DTO\Post;

use App\Modules\Feed\Domain\Entity\Post;

final class PostWithLikeFlagDTO
{
    public function __construct(
        public Post $post,
        public bool $likedByCurrentUser,
    ) {}
}
