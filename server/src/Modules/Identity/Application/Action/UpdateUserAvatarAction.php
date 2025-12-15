<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;

final class UpdateUserAvatarAction
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function __invoke(User $user, ?string $avatarUrl): void
    {
        $user->setAvatarUrl($avatarUrl);
        $this->users->save($user, true);
    }
}
