<?php

namespace App\Modules\Media\Application\DTO;

use App\Enum\FileTypeEnum;

final readonly class PostMediaItem
{
    public function __construct(
        public string $id,
        public FileTypeEnum $fileType,
        public string $url,
        public string $createdAt,
    ) {}
}
