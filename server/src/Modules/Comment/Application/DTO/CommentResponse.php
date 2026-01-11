<?php

namespace App\Modules\Comment\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final readonly class CommentResponse
{
    public function __construct(
        public string $id,
        public string $content,
        public UserPreviewDTO $author,
        public \DateTimeImmutable $createdAt,
        public int $likeCount,
        public int $replyCount,
        public bool $likedByCurrentUser,
    ) {}
}
