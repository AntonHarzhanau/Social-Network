<?php

namespace App\DTO\Auth;

final readonly class MeUserDTO
{
    public function __construct(
        public string $id,
        public string $email,
        public string $username,
        public ?string $slug,
        public ?string $avatarUrl,
    ) {}
}
