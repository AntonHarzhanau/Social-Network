<?php

namespace App\Modules\Feed\Infrastructure\Adapter;

use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\User\Api\UserApiInterface;
use App\Modules\User\Domain\Entity\User;

class UserDirectoryAdapter implements UserDirectoryInterface
{
    public function __construct(
        private readonly UserApiInterface $userApi,
    ) {}

    public function getUser(string $userId): ?User
    {
        return $this->userApi->findById($userId);
    }

    public function findPreviewsByIds(array $ids): array
    {
        return $this->userApi->findPreviewsByIds($ids);
    }

    public function findPreviewsByWallIds(array $wallIds): array
    {   $users = $this->userApi->findPreviewByWallIds($wallIds);
        $result = [];
        foreach ($users as $user) {
            $result[$user->wallId] = $user;
        }
        return $result;
    }
}
