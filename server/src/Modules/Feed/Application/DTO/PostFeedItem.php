<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final  class PostFeedItem
{
    public function __construct(
        public string $id,
        public string $content,
        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,
        public \DateTimeImmutable $date,
        public UserPreviewDTO $author,
        public array $media = [],
    ) {}
}
