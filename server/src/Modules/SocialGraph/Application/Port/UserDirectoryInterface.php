<?php

namespace App\Modules\SocialGraph\Application\Port;

use App\Modules\Identity\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

interface UserDirectoryInterface
{
    public function getUserEntityOrFail(Uuid $userId): User;
}
