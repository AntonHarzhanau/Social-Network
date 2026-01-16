<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\Group\Api\DTO\GroupPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final class PostResponse
{
    public function __construct(
        public string $id,
        public string $wallId,
        public string $wallOwnerType,
        public UserPreviewDTO | GroupPreviewDTO | null $author = null,

        // public ?UserPreviewDTO $author = null,
        public string $content,
        public string $commentThreadId,

        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,

        public \DateTimeImmutable $createdAt,
        public array $media = [],

        public string $kind,
        public ?string $originalPostId = null,
        public ?string $quote = null,
        // public ?UserPreviewDTO $actor = null,
    ) {}
}
