<?php

namespace App\Modules\User\Application\Mapper;

use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\User\Contracts\DTO\UserDetailsDTO;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Domain\Entity\User;

final class UserMapper
{
    public function __construct(
        private GetMediaUrl $getUrl,
    ) {}

    public function toPreview(User $user)
    {
        $avatarUrl = $user->getCurrentAvatar()
            ? ($this->getUrl)($user->getCurrentAvatar()->getPreview()->getStorageKey())
            : null;
        return new UserPreviewDTO(
            id: $user->getId(),
            username: $user->getUsername(),
            avatarUrl: $avatarUrl,
            slug: $user->getSlug(),
        );
    }

    public function toDetails(User $user)
    {
        $avatarUrl = $user->getCurrentAvatar()
            ? ($this->getUrl)($user->getCurrentAvatar()->getPreview()->getStorageKey())
            : null;
        return new UserDetailsDTO(
            id: (string) $user->getId(),
            email: (string) $user->getEmail(),
            username: (string) $user->getUsername(),
            slug: $user->getSlug(),
            avatarUrl: $avatarUrl,
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
