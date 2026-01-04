<?php

namespace App\Modules\Chat\Infrastructure\Adapter;

use App\Modules\User\Domain\Entity\User;
use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\User\Api\UserApiInterface;

final class UserDirectoryAdapter implements UserDirectoryInterface
{
    public function __construct(private UserApiInterface $userService) {}

    public function findById(string $userId): ?User
    {
        $user = $this->userService->findById($userId);

        return $user;
    }

    /** @return list<UserPreview> */
    public function findManyByIds(array $userIds): array
    {
        $users = $this->userService->findManyByIds($userIds);

        return $users;
    }

    /** @return UserPreviewDTO[] */
    public function getPreviewsByIds(array $userIds): array
    {
        $previews = $this->userService->findPreviewsByIds($userIds);

        return $previews;
    }
}
