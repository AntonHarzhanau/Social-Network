<?php

namespace App\DTO\Comment;

use App\DTO\User\UserResponseDTO;

final readonly class CommentViewDTO
{
    public function __construct(
        public string $id,
        public UserResponseDTO $author,
        public string $content,
        public int $likeCount,
        public \DateTimeImmutable $createdAt,
        public bool $likedByCurrentUser,
        public int $replyCount,
    ) {}
}
