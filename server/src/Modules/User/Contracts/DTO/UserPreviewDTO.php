<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserPreviewDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $username,
        public readonly ?string $avatarUrl = null,
        public readonly ?string $slug = null,
        public readonly string $wallId,
    ) {}
}
