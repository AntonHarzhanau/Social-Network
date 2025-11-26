<?php

namespace App\DTO\PostDTO;

use App\Enum\VisibilityEnum;

final readonly class CreatePostDTO
{
    public function __construct(
        public ?string $content = null,
        public ?VisibilityEnum $visibility = null,
    ) {}
}
