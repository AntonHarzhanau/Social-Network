<?php

namespace App\DTO\Post;

use App\DTO\Common\AuthorSummaryDTO;

final readonly class PostFeedItemDTO
{
    public function __construct(
        public string $id,
        public string $content,
        public \DateTimeImmutable $date,
        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,
        public AuthorSummaryDTO $author,
        public array $media,
    ) {}
}
