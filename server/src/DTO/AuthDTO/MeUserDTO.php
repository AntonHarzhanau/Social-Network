<?php

namespace App\DTO\AuthDTO;

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
