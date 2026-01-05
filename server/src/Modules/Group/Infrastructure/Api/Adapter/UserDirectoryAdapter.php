<?php

namespace App\Modules\Group\Infrastructure\Api\Adapter;

use App\Modules\Group\Application\Port\UserDirectoryInterface;
use App\Modules\User\Api\UserApiInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class UserDirectoryAdapter implements UserDirectoryInterface
{
    public function __construct(
        private readonly UserApiInterface $userApi,
    ) {}

    public function findById(Uuid $id): ?User
    {
        return $this->userApi->findById((string)$id);
    }

    /** @return list<User> */
    public function findPreviewsByIds(array $ids): array
    {
        return $this->userApi->findPreviewsByIds($ids);
    }
}
