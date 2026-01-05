<?php

namespace App\Modules\Group\Application\Port;

use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

interface UserDirectoryInterface
{
    public function findById(Uuid $id): ?User;
    /** @return list<User> */
    public function findPreviewsByIds(array $ids): array;
}
