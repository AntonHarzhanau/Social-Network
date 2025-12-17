<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class UpdateUserAvatarAction
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function __invoke(Uuid $userId, ?string $avatarUrl): void
    {
        $user = $this->users->findById($userId->toRfc4122());
        if ($user === null) {
            throw new \RuntimeException('User not found.');
        }
        
        $user->setAvatarUrl($avatarUrl);
        $this->users->save($user, true);
    }
}
