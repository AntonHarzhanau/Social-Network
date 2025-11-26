<?php

namespace App\DTO\Post;

use App\Enum\VisibilityEnum;

final readonly class CreatePostDTO
{
    public function __construct(
        public ?string $content = null,
        public ?VisibilityEnum $visibility = null,
    ) {}
}
