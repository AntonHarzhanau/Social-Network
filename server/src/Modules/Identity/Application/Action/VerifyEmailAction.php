<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Domain\Exception\EmailVerificationExpiredException;
use App\Modules\Identity\Domain\Exception\EmailVerificationInvalidException;
use App\Modules\Identity\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;

final class VerifyEmailAction
{
    public function __construct(
        private EmailVerificationRepositoryInterface $emailVerifications,
        private UserRepositoryInterface $users,
    ) {}

    public function __invoke(string $rawToken): void
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

        // Одна транзакция/flush: можно так
        $this->emailVerifications->save($ev, false);
        $this->users->save($user, true);
    }
}
