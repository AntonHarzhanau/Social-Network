<?php

namespace App\Modules\User\Application\DTO;

final readonly class UserPreviewDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $username,
        public readonly ?string $avatarUrl,
        public readonly ?string $slug,
    ) {
    }
}
