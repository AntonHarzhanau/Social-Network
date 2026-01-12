<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final readonly class PostResponse
{
    public function __construct(
        public string $id,
        public ?string $content,

        public PostContextDTO $context,

        public UserPreviewDTO $author,

        public \DateTimeImmutable $createdAt,
        public ?\DateTimeImmutable $updatedAt,

        public VisibilityEnum $visibility,

        public int $likeCount,
        public int $commentCount,
        public bool $likedByCurrentUser,

        /** @var array<MediaDTO> */
        public array $medias,
    ) {}
}
