<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\UserMediaBinding;
use Symfony\Component\Uid\Uuid;

interface UserMediaBindingRepositoryInterface
{
    public function save(UserMediaBinding $entity, bool $flush = true): void;

    public function remove(UserMediaBinding $entity, bool $flush = true): void;

    public function findMediasByUserId(Uuid $userId): array;
}
