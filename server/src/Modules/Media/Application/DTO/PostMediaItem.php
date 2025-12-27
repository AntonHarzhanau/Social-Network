<?php

namespace App\Modules\Media\Application\DTO;

use App\Modules\Media\Domain\Enum\FileTypeEnum;

final readonly class PostMediaItem
{
    public function __construct(
        public string $id,
        public FileTypeEnum $fileType,
        public string $url,
        public string $createdAt,
    ) {}
}
