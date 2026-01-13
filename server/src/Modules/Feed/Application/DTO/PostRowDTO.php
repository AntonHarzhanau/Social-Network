<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\Feed\Domain\Enum\PostKindEnum;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;

final class PostRowDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $wallId,
        public readonly WallOwnerTypeEnum $wallOwnerType,

        public readonly string $authorId,
        public readonly ?string $content,
        public readonly string $commentThreadId,

        public readonly int $likeCount,
        public readonly int $commentCount,
        public readonly bool $isLikedByCurrentUser,
        public readonly \DateTimeImmutable $createdAt,

        public readonly PostKindEnum $kind,
        public readonly ?string $originalPostId,
        public readonly ?string $quote,

    ) {}
}
