<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;

final class UpdateProfileAction
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function __invoke(
        User $user,
        ?string $username = null,
        ?string $location = null,
        ?string $bio = null,
        ?string $coverUrl = null,
        ?string $maritalStatus = null,
    ): void {
        if ($username !== null) $user->setUsername($username);
        if ($location !== null) $user->setLocation($location);
        if ($bio !== null) $user->setBio($bio);
        if ($coverUrl !== null) $user->setCoverUrl($coverUrl);
        if ($maritalStatus !== null) $user->setMaritalStatus($maritalStatus);

        $this->users->save($user, true);
    }
}
