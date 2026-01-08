<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

class DeleteAccountAction
{
    public function __construct(private UserRepositoryInterface $userRepository) {}

    public function execute(Uuid $userId): void {

        $user = $this->userRepository->findById($userId->toRfc4122());
        if ($user === null || $user->getDeletedAt() !== null) {
            throw new \RuntimeException('User not found.');
        }

        $user->setDeletedAt(new \DateTimeImmutable());
        $this->userRepository->save($user);
    }
}
