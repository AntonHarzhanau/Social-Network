<?php

namespace App\Modules\User\Application\Mapper;

use App\Modules\User\Application\DTO\UserPreviewDTO;
use App\Modules\User\Application\DTO\UserDetailsDTO;
use App\Modules\User\Domain\Entity\User;

final class UserMapper
{
    public function toPreview(User $user)
    {
        return new UserPreviewDTO(
            id: $user->getId(),
            username: $user->getUsername(),
            avatarUrl: $user->getAvatarUrl(),
            slug: $user->getSlug(),
        );
    }

    public function toDetails(User $user)
    {
        return new UserDetailsDTO(
            id: (string) $user->getId(),
            email: (string) $user->getEmail(),
            username: (string) $user->getUsername(),
            slug: $user->getSlug(),
            avatarUrl: $user->getAvatarUrl(),
            coverUrl: $user->getCoverUrl(),
            location: $user->getLocation(),
            maritalStatus: $user->getMaritalStatus(),
            bio: $user->getBio(),
            dateOfBirth: $user->getDateOfBirth()?->format('Y-m-d') ?? '',
            createdAt: $user->getCreatedAt()?->format(\DateTimeInterface::ATOM) ?? '',
            emailVerifiedAt: $user->getEmailVerifiedAt()?->format(\DateTimeInterface::ATOM),
            lastLoginAt: $user->getLastLoginAt()?->format(\DateTimeInterface::ATOM),
        );
    }
}
