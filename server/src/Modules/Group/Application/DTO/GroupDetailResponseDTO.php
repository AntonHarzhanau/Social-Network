<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\Media\Api\DTO\MediaItemDTO;

final readonly class GroupDetailResponseDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public string $groupVisibility,
        public bool $isMember,
        public ?string $role,
        public ?string $description,
        public int $subscribersCount,
        public ?string $wallId,
        public ?MediaItemDTO $currentAvatar,
        public ?MediaItemDTO $cover,
    ) {}
}
