<?php

namespace App\Modules\SocialGraph\Infrastructure\Adapter;

use App\Modules\Identity\Application\UserService;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Uid\Uuid;

final class UserDirectorySymfonyAdapter implements UserDirectoryInterface
{
    public function __construct(private UserService $userService) {}

    public function getUserEntityOrFail(Uuid $userId): User
    {
        $user = $this->userService->getUserById($userId->toRfc4122());
        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        return $user;
    }
}
