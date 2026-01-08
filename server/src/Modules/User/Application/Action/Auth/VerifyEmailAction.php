<?php

namespace App\Modules\User\Application\Action\Auth;

use App\Modules\User\Domain\Exception\EmailVerificationExpiredException;
use App\Modules\User\Domain\Exception\EmailVerificationInvalidException;
use App\Modules\User\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class VerifyEmailAction
{
    public function __construct(
        private EmailVerificationRepositoryInterface $emailVerifications,
        private UserRepositoryInterface $users,
    ) {}

    public function execute(string $rawToken): void
    {
        $tokenHash = hash('sha256', $rawToken);

        $ev = $this->emailVerifications->findByTokenHash($tokenHash);
        if ($ev === null) {
            throw new EmailVerificationInvalidException();
        }

        $now = new \DateTimeImmutable();

        if ($ev->getConsumedAt() !== null || $ev->getExpiresAt() <= $now) {
            throw new EmailVerificationExpiredException();
        }

        $ev->setConsumedAt($now);

        $user = $ev->getUser();
        $user->setEmailVerifiedAt($now);

        $this->emailVerifications->save($ev, false);
        $this->users->save($user, true);
    }
}
