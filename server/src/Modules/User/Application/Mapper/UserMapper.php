<?php

namespace App\Modules\User\Application\Mapper;

use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\User\Contracts\DTO\UserDetailsDTO;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO;
use App\Modules\User\Domain\Entity\User;

final class UserMapper
{
    private const ONLINE_THRESHOLD_SECONDS = 180;
    public function __construct(
        private GetMediaUrl $getUrl,
    ) {
    }

    public function toPreview(UserPreviewRowDTO $user, string|null $avatarUrl = null): UserPreviewDTO
    {
        
        return new UserPreviewDTO(
            id: $user->id,
            name: $user->username,
            avatarUrl: $avatarUrl,
            slug: $user->slug,
            wallId: $user->wallId,
            lastLoginAt: $user->lastLoginAt?->format(\DateTimeInterface::ATOM),
            isOnline: $this->isUserOnline($user->lastLoginAt),
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
            name: (string) $user->getUsername(),
            slug: $user->getSlug(),
            avatarUrl: $avatarUrl,
            coverUrl: $user->getCoverUrl(),
            location: $user->getLocation(),
            maritalStatus: $user->getMaritalStatus(),
            bio: $user->getBio(),
            dateOfBirth: $user->getDateOfBirth()?->format('Y-m-d') ?? '',
            createdAt: $user->getCreatedAt()?->format(\DateTimeInterface::ATOM) ?? '',
            emailVerifiedAt: $user->getEmailVerifiedAt()?->format(\DateTimeInterface::ATOM),
            wallId: (string) $user->getWall()->getId(),
            lastLoginAt: $user->getLastLoginAt()?->format(\DateTimeInterface::ATOM),
            isOnline: $this->isUserOnline($user->getLastLoginAt())
        );
    }

    private function isUserOnline(?\DateTimeImmutable $lastLoginAt): bool
    {
        $now = new \DateTimeImmutable();

        if (!$lastLoginAt instanceof \DateTimeInterface) {
            return false;
        }

        $lastActiveAt = \DateTimeImmutable::createFromInterface($lastLoginAt);
        return ($now->getTimestamp() - $lastActiveAt->getTimestamp()) <= self::ONLINE_THRESHOLD_SECONDS;
    }
}
