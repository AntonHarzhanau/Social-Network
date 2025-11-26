<?php

namespace App\Factory\User;

use App\DTO\AuthDTO\MeUserDTO;
use App\Entity\User;

final readonly class UserFactory
{
    public function toMeUserDTO(User $user): MeUserDTO
    {
        return new MeUserDTO(
            id: $user->getId(),
            email: $user->getEmail(),
            username: $user->getUsername(),
            slug: $user->getSlug(),
            avatarUrl: $user->getAvatarUrl(),
        );
    }
}
