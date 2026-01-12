<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final  class PostFeedItem
{
    public function __construct(
        public string $id,
        public string $wallId,
        public ?UserPreviewDTO $author = null,
        public string $content,
        public string $commentThreadId,
        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,
        public \DateTimeImmutable $date,
        public array $media = [],
        public string $publicationId,
        public ?UserPreviewDTO $actor = null,
        public PostContextDTO $context,
        public ?string $actorId = null,
    ) {}
}
