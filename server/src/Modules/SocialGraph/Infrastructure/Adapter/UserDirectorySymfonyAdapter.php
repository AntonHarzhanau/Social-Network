<?php

namespace App\Modules\SocialGraph\Infrastructure\Adapter;

use App\Entity\User;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Service\User\UserService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Uid\Uuid;

final class UserDirectorySymfonyAdapter implements UserDirectoryInterface
{
    public function __construct(private UserService $users) {}

    public function getUserEntityOrFail(Uuid $userId): User
    {
        $user = $this->users->getUserById($userId->toRfc4122());
        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        return $user;
    }
}
