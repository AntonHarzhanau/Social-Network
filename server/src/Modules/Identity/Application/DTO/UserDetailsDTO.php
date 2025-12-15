<?php

namespace App\Modules\Identity\Application\DTO;

final readonly class UserDetailsDTO
{
    public function __construct(
        public string $id,
        public string $email,
        public string $username,
        public ?string $slug,
        public ?string $avatarUrl,
        public ?string $coverUrl,
        public ?string $location,
        public ?string $maritalStatus,
        public ?string $bio,
        public string $dateOfBirth, 
        public string $createdAt,
        public ?string $emailVerifiedAt,
        public ?string $lastLoginAt,
    ) {}
}
