<?php

namespace App\Service;

use App\DTO\Auth\RegisterUserDTO;
use App\Entity\User;
use App\Repository\UserRepository;
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

        $user = new User();
        $user->setEmail($dto->email);
        $user->setUsername($dto->username);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $dto->password);
        $user->setPassword($hashedPassword);
        $user->setDateOfBirth(new \DateTimeImmutable($dto->dateOfBirth));
        $this->userRepository->save($user);
    }

}
