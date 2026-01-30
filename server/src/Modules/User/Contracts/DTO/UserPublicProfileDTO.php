<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserPublicProfileDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $slug,
        public ?string $avatarUrl,
        public ?string $coverUrl,
        public bool $isOnline,
    ) {}
}
