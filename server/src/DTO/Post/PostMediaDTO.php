<?php

namespace App\DTO\Post;

use App\Enum\FileTypeEnum;

final readonly class PostMediaDTO
{
    public function __construct(
        public string $id,
        public string $url,
        public FileTypeEnum $type,
    ) {}
}
