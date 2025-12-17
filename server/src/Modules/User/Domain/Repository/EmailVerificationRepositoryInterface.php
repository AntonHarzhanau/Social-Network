<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\EmailVerification;

interface EmailVerificationRepositoryInterface
{
    public function save(EmailVerification $emailVerification, bool $flush = true): void;
    public function findByTokenHash(string $tokenHash): ?EmailVerification;
}
