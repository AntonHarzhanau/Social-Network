<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\Media\Api\DTO\MediaItemDTO;

final readonly class GroupDetailResponseDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public bool $isMember,
        public int $subscribersCount,
        public ?MediaItemDTO $currentAvatar,
        public string $groupVisibility,
        public ?string $role,
        public ?string $status,
        public ?string $description,
        public ?string $wallId,
        public ?MediaItemDTO $cover,
    ) {}
}
