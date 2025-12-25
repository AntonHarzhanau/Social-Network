<?php

namespace App\Security;

use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserStatusChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if ($user->getDeletedAt() !== null) {
            throw new DisabledException('Account deleted.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }
        if ($user->getEmailVerifiedAt() === null) {
            throw new CustomUserMessageAccountStatusException('Email not verified.');
        }
    }
}
