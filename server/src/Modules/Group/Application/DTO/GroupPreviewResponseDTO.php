<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\Media\Api\DTO\MediaItemDTO;

final readonly class GroupPreviewResponseDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public bool $isMember,
        public ?string $role,
        public ?string $status,
        public int $subscribersCount,
        public ?MediaItemDTO $currentAvatar,
    ) {}
}
