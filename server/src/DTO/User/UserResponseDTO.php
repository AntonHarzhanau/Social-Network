<?php

namespace App\DTO\User;

use Symfony\Component\Serializer\Attribute\Groups;

final readonly class UserResponseDTO
{
    public function __construct(
        #[Groups(['user:preview', 'post:feed', 'post:comment', 'user:fullProfile', 'message:list'])]
        public string $id,
        #[Groups(['user:preview', 'post:feed', 'post:comment', 'user:fullProfile', 'message:list'])]
        public string $username,
        #[Groups(['user:preview', 'post:feed', 'post:comment', 'user:fullProfile', 'message:list'])]
        public ?string $slug = null,
        #[Groups(['user:preview', 'post:feed', 'post:comment', 'user:fullProfile', 'message:list'])]
        public ?string $avatarUrl = null,
        #[Groups(['user:fullProfile'])]
        public ?string $coverUrl = null,
        #[Groups(['user:fullProfile'])]
        public ?string $location = null,
        #[Groups(['user:fullProfile'])]
        public ?string $bio = null,
        #[Groups(['user:fullProfile'])]
        public ?string $maritalStatus = null,
        #[Groups(['user:fullProfile'])]
        public ?\DateTimeImmutable $dateOfBirth = null,
        #[Groups(['user:preview'])]
        public ?\DateTimeImmutable $lastLoginAt = null,

    ) {}
}
