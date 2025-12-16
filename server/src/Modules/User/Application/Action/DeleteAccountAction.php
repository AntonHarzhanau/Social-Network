<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

class DeleteAccountAction
{
    public function __construct(private UserRepositoryInterface $userRepository) {}

    public function __invoke(Uuid $userId): void {

        $user = $this->userRepository->findOneById($userId->toRfc4122());
        if ($user === null) {
            throw new \RuntimeException('User not found.');
        }

        $this->userRepository->delete($user, true);
    }
}
