<?php

namespace App\Modules\Group\Application\DTO;

final readonly class GroupDetailsRawDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $description,
        public bool $isMember,
        public int $subscribersCount,
        public ?string $currentAvatarId,
    ) {}
} 
