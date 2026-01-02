<?php

namespace App\Modules\Feed\Application\DTO;

use Symfony\Component\Uid\Uuid;

final class PostFeedRowDTO
{
    public function __construct(
        public Uuid $id,
        public ?string $content,
        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,
        public \DateTimeImmutable $createdAt,
        public Uuid $authorId,
    ) {}
}
