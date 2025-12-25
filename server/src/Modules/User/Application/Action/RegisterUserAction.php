<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Event\UserRegistredEvent;
use App\Modules\User\Domain\Exception\EmailAlreadyInUseException;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Domain\Service\PasswordHasher;

final class RegisterUserAction
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private PasswordHasher $passwordHasher,
    ) {}

    public function __invoke(
        string $email,
        string $firstName,
        string $lastName,
        string $plainPassword,
        string $dateOfBirthIso,
        ?string $ip = null,
        ?string $userAgent = null,
    ): UserRegistredEvent {

        $passwordHash = $this->passwordHasher->hash($plainPassword);


        $email = mb_strtolower(trim($email));

        if ($this->userRepository->findByEmail($email) !== null) {
            throw new EmailAlreadyInUseException($email);
        }

        $username = trim($firstName . ' ' . $lastName);
        $user = new User();
        $user->setEmail($email);
        $user->setUsername($username);
        $user->setPassword($passwordHash);
        $user->setDateOfBirth(new \DateTimeImmutable($dateOfBirthIso));

        $this->userRepository->save($user, true);
        $user = $this->userRepository->findByEmail($email);

        return new UserRegistredEvent($user, $ip, $userAgent);
    }
}
