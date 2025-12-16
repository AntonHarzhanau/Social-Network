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
        $user = new User(
            null,
            $email,
            $passwordHash,
            new \DateTimeImmutable($dateOfBirthIso),
            $username,
            ['ROLE_USER'],
        );
        
        $this->userRepository->save($user, true);

        return new UserRegistredEvent($user);

        // $rawToken = bin2hex(random_bytes(32));
        // $tokenHash = hash('sha256', $rawToken);

        // $now = new \DateTimeImmutable();
        // $expiresAt = $now->add(new \DateInterval('PT24H'));

        // $ev = new EmailVerification();
        // $ev->setUser($user);
        // $ev->setTokenHash($tokenHash);
        // $ev->setSentEmail($user->getEmail());
        // $ev->setCreatedAt($now);
        // $ev->setExpiresAt($expiresAt);
        // $ev->setIp($ip);
        // $ev->setUserAgent($userAgent);

        // $this->emailVerifications->save($ev, true);

        // return $rawToken;
    }
}
