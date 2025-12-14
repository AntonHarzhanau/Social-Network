<?php

namespace App\Factory\User;

use App\DTO\User\UserResponseDTO;
use App\Modules\Identity\Domain\Entity\User;

final readonly class UserFactory
{
    public function toUserResponseDTO(User $user): UserResponseDTO
    {
        return new UserResponseDTO(
            id: $user->getId(),
            username: $user->getUsername(),
            avatarUrl: $user->getAvatarUrl(),
            slug: $user->getSlug(),
            coverUrl: $user->getCoverUrl(),
            location: $user->getLocation(),
            bio: $user->getBio(),
            maritalStatus: $user->getMaritalStatus(),
            dateOfBirth: $user->getDateOfBirth(),
            lastLoginAt: $user->getLastLoginAt(),
        );
    }
}
