<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\Feed\Domain\Enum\WallPostKindEnum;

final readonly class WallPostFeedRowDTO
{
    public function __construct(
        public string $publicationId,
        public \DateTimeImmutable $publishedAt,

        public string $postId,
        public ?string $content,
        public int $likeCount,
        public int $commentCount,
        public bool $likedByCurrentUser,

        public string $authorId,
        public ?string $actorId = null,

        public string $wallId,
        public WallPostKindEnum $kind,
        public ?string $quote = null,

        public string $commentThreadId,
    ) {}
}
