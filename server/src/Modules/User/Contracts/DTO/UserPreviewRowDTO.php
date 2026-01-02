<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserPreviewRowDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $username,
        public readonly ?string $currentAvatar = null,
        public readonly ?string $slug = null,
    ) {
    }
}
