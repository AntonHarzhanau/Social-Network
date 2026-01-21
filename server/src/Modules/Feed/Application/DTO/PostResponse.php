<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final class PostResponse
{
    public function __construct(
        public string $id,
        public string $wallId,
        public WallOwnerPreviewDTO $wallOwner,

        public ?UserPreviewDTO $author,
        public string $content,
        public string $commentThreadId,

        public int $likeCount,
        public int $commentCount,
        public bool $isLikedByCurrentUser,

        public \DateTimeImmutable $createdAt,
        public array $media = [],
        public bool $canDelete,

        public string $kind,
        public ?ReshareInfoDTO $reshare = null,

    ) {
    }
}
