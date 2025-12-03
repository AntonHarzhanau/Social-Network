<?php

namespace App\DTO\Media;

use App\Enum\FileTypeEnum;

final readonly class MediaResponseDTO
{
    public function __construct(
        public string $id,
        public FileTypeEnum $fileType,
        public string $url,
        public string $createdAt,
    ) {}
}
