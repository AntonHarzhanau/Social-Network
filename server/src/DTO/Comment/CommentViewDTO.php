<?php

namespace App\DTO\Comment;

use App\DTO\Common\AuthorSummaryDTO;

final readonly class CommentViewDTO
{
    public function __construct(
        public string $id,
        public AuthorSummaryDTO $author,
        public string $content,
        public int $likeCount,
        public \DateTimeImmutable $createdAt,
        public bool $likedByCurrentUser,
        public int $replyCount,
    ) {}
}
