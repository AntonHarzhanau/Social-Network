<?php

namespace App\Modules\Group\Api\DTO;

final readonly class GroupPreviewDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public string $wallId,
        public ?string $avatarUrl,
    ) {}
}
