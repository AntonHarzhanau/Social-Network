<?php

namespace App\Modules\Comment\Application\ReadModel;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final readonly class CommentView
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
