<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;

final class FindUserProfileAction
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function __invoke(string $userId): array
    {
        $user = $this->users->findById($userId);

        return [
            'id' => (string) $user->getId(),
            'username' => $user->getUsername(),
            'slug' => $user->getSlug(),
            'avatarUrl' => $user->getAvatarUrl(),
        ];
    }
}
