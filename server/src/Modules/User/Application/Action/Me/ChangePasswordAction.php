<?php

namespace App\Modules\User\Application\Action\Me;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

final class ChangePasswordAction
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(User $user, string $oldPassword, string $newPassword): void
    {
        if ($user->getDeletedAt() !== null) {
            throw new \DomainException('Account is deleted.');
        }

        if (!$this->passwordHasher->isPasswordValid($user, $oldPassword)) {
            throw new BadCredentialsException('Old password is incorrect.');
        }

        if ($this->passwordHasher->isPasswordValid($user, $newPassword)) {
            throw new \DomainException('New password must be different from the old password.');
        }

        $user->setPassword($this->passwordHasher->hashPassword($user, $newPassword));
        $this->users->save($user, true);

    }
}
