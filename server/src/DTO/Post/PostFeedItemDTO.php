<?php

namespace App\DTO\Post;

use App\DTO\Common\AuthorSummaryDTO;

final readonly class PostFeedItemDTO
{
    public function __construct(
        public string $id,
        public AuthorSummaryDTO $author,
        public string $content,
        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,
        public \DateTimeImmutable $date,
        public array $media,
    ) {}
}
