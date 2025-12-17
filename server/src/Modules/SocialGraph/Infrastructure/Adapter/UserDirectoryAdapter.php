<?php

namespace App\Modules\SocialGraph\Infrastructure\Adapter;

use App\Modules\User\Domain\Entity\User;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\User\Api\UserApiInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class UserDirectoryAdapter implements UserDirectoryInterface
{
    public function __construct(private UserApiInterface $userService) {}

    public function getUserEntityOrFail(string $userId): User
    {
        $user = $this->userService->findById($userId);
        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        return $user;
    }
}
