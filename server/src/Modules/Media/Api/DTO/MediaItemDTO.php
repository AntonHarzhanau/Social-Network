<?php

namespace App\Modules\Media\Api\DTO;

final class MediaItemDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $url,
        public readonly string $type,
        public readonly \DateTimeImmutable $createdAt,
    ) {}
}
