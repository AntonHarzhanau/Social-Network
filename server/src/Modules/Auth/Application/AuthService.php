<?php

namespace App\Modules\Auth\Application;

use App\DTO\Auth\RegisterUserDTO;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Infrastructure\Persistence\Doctrine\Repository\UserRepository;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    )
    {}

    public function register(RegisterUserDTO $dto): void
    {
        if ($this->userRepository->findByEmail($dto->email) !== null) {
            throw new ConflictHttpException('Email is already in use.');
        }

        $fullName = $dto->firstName . ' ' . $dto->lastName;

        $user = new User();
        $user->setEmail($dto->email);
        $user->setUsername($fullName);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $dto->password);
        $user->setPassword($hashedPassword);
        $user->setDateOfBirth(new \DateTimeImmutable($dto->dateOfBirth));
        $this->userRepository->save($user);
    }

}
