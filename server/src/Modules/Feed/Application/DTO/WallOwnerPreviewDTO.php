<?php

namespace App\Modules\Feed\Application\DTO;
final class WallOwnerPreviewDTO
{
    public function __construct(
        public string $id,
        public string $type,     // "user" | "group"
        public string $name,
        public ?string $avatarUrl = null,
        public string $wallId = '',
        public bool $isDeleted = false,
    ) {}
}
