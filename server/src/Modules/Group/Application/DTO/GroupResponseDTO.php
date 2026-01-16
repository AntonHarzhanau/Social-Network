<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\Media\Api\DTO\MediaItemDTO;

final readonly class GroupResponseDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public bool $isMember,
        public int $subscribersCount,
        public string $wallId,
        public ?MediaItemDTO $currentAvatar,
    ) {}
}
