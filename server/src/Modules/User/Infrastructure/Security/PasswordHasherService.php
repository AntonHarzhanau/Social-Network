<?php

namespace App\Modules\User\Infrastructure\Security;

use App\Modules\User\Domain\Service\PasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class PasswordHasherService implements PasswordHasher
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function hash(string $plainPassword): string
    {
        $dummyUser = new class implements PasswordAuthenticatedUserInterface {
            public function getPassword(): ?string
            {
                return null;
            }
        };
        return $this->passwordHasher->hashPassword($dummyUser, $plainPassword);
    }
}
