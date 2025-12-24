<?php

namespace App\Modules\Chat\Application\Port;

use App\Modules\User\Domain\Entity\User;

interface UserDirectoryInterface
{
    public function findById(string $userId): ?User;

    /** @return User[] */
    public function findManyByIds(array $userIds): array;
}
