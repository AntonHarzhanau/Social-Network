<?php

namespace App\Modules\Feed\Application\DTO;

final class ReshareInfoDTO
{
    public function __construct(
        public string $originalPostId,
        public WallOwnerPreviewDTO $originalWallOwner, // владелец стены оригинала (user/group)
        public ?string $quote = null,
    ) {
    }
}
