<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Domain\Entity\EmailVerification;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Domain\Exception\EmailAlreadyInUseException;
use App\Modules\Identity\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class RegisterUserAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private EmailVerificationRepositoryInterface $emailVerifications,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function __invoke(
        string $email,
        string $firstName,
        string $lastName,
        string $plainPassword,
        string $dateOfBirthIso,
        ?string $ip = null,
        ?string $userAgent = null,
    ): string {
        $email = mb_strtolower(trim($email));

        if ($this->users->findByEmail($email) !== null) {
            throw new EmailAlreadyInUseException($email);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setUsername(trim($firstName . ' ' . $lastName));
        $user->setDateOfBirth(new \DateTimeImmutable($dateOfBirthIso));

        $hash = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hash);

        $this->users->save($user, true);

        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);

        $now = new \DateTimeImmutable();
        $expiresAt = $now->add(new \DateInterval('PT24H'));

        $ev = new EmailVerification();
        $ev->setUser($user);
        $ev->setTokenHash($tokenHash);
        $ev->setSentEmail($user->getEmail());
        $ev->setCreatedAt($now);
        $ev->setExpiresAt($expiresAt);
        $ev->setIp($ip);
        $ev->setUserAgent($userAgent);

        $this->emailVerifications->save($ev, true);

        return $rawToken;
    }
}
