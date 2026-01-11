<?php

namespace App\Modules\Media\Api\DTO;

final class MediaItemDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $url,
        public readonly string $type,
        public readonly \DateTimeImmutable $createdAt,
        public readonly ?int $width = null,
        public readonly ?int $height = null,
        public readonly ?float $durationSeconds = null,
        public readonly string $commentThreadId,
        public readonly int $likeCount,
        public readonly ?bool $likedByCurrentUser = null,
    ) {}
}
