<?php

namespace App\Modules\Notification\Infrastructure\Adapter;

use App\Modules\Notification\Application\Port\UserDirectioryInterface;
use App\Modules\User\Api\UserApiInterface;

final class UserDirectoryAdapter implements UserDirectioryInterface
{
    public function __construct(private UserApiInterface $userApi)
    {
    }
    public function getUser(string $userId)
    {
        return $this->userApi->findById($userId);
    }

    public function getUserPreviews(array $userIds): array
    {
        return $this->userApi->findPreviewsByIds($userIds);
    }
}
