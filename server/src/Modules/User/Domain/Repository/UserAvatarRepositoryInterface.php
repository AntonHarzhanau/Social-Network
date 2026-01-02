<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\UserAvatar;

interface UserAvatarRepositoryInterface
{
    public function save(UserAvatar $avatar, bool $flush = true): void;
    public function delete(UserAvatar $avatar, bool $flush = true): void;
}
