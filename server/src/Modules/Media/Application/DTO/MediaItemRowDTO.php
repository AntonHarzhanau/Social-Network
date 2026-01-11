<?php

namespace App\Modules\Media\Application\DTO;

use App\Modules\Media\Domain\Enum\FileTypeEnum;
use Symfony\Component\Uid\Uuid;

final class MediaItemRowDTO
{
    public function __construct(
        public readonly Uuid $id,
        public readonly string $storageKey,
        public readonly FileTypeEnum $type,
        public readonly \DateTimeImmutable $createdAt,
        public readonly ?int $width,
        public readonly ?int $height,
        public readonly ?float $durationSeconds,
        public readonly Uuid $commentThreadId,
        public readonly int $likeCount,
        public readonly bool $likedByCurrentUser,
    ) {}
}
