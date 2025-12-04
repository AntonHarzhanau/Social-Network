<?php

namespace App\DTO\Media;

use App\Enum\FileTypeEnum;
use Symfony\Component\Serializer\Attribute\Groups;

final readonly class MediaResponseDTO
{
    public function __construct(
        #[Groups(['post:feed', 'post:full'])]
        public string $id,
        #[Groups(['post:feed', 'post:full'])]
        public FileTypeEnum $fileType,
        #[Groups(['post:feed', 'post:full'])]
        public string $url,
        #[Groups(['post:feed', 'post:full'])]
        public string $createdAt,
    ) {}
}
