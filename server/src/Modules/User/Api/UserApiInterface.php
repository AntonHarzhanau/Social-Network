<?php

namespace App\Modules\User\Api;

use App\Modules\User\Domain\Entity\User;

interface UserApiInterface
{
    public function findById(string $id): ?User;
}
