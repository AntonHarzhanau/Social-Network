<?php

namespace App\Modules\Feed\Application\Port;

use App\Modules\User\Domain\Entity\User;

interface UserDirectoryInterface
{
    public function getUser(string $userId): ?User;

    public function findPreviewsByIds(array $ids): array;

    public function findPreviewsByWallIds(array $wallIds): array;
}
