<?php

namespace App\DTO\Comment;

final readonly class CreateCommentDTO
{
    public function __construct(
        public ?string $content = null,
    ) {}
}
