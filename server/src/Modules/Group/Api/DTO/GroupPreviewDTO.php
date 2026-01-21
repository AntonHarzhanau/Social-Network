<?php

namespace App\Modules\Group\Api\DTO;

use App\Modules\Media\Api\DTO\MediaItemDTO;

final readonly class GroupPreviewDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public string $wallId,
        public bool $isMember,
        public ?string $role,
        public int $subscribersCount,
        public ?string $avatarUrl,
    ) {}
}
