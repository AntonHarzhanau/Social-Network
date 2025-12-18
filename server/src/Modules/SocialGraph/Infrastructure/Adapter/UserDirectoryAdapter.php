<?php

namespace App\Modules\SocialGraph\Infrastructure\Adapter;

use App\Modules\User\Domain\Entity\User;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\User\Api\UserApiInterface;

final class UserDirectoryAdapter implements UserDirectoryInterface
{
    public function __construct(private UserApiInterface $userService) {}

    public function getUser(string $userId): ?User
    {
        $user = $this->userService->findById($userId);

        return $user;
    }

    /** @return list<UserPreview> */
    public function findPreviewsByIds(array $ids): array
    {
        return $this->userService->findPreviewsByIds($ids);
    }
}
