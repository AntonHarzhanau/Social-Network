<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class RecoveryAccountRequestAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function __invoke(string $email): void
    {
        $user = $this->userRepository->findByEmail($email);

        if ($user === null) {
            return;
        }
        $tokenHash = hash('sha256', bin2hex(random_bytes(32)));
        
    }
}
