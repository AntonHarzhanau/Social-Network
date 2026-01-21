<?php

namespace App\Modules\User\Application\Action\Auth;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class UpdateMyPresenceAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(
        User $user,
    ): void {
        $user->setLastLoginAt(new \DateTimeImmutable());
        $this->userRepository->save($user);        
    }
}
