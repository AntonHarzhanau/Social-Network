<?php

namespace App\Modules\Identity\Domain\Repository;

use App\Modules\Identity\Domain\Entity\EmailVerification;
use App\Modules\Identity\Domain\Entity\User;

interface EmailVerificationRepositoryInterface
{
    public function findByTokenHash(string $tokenHash): ?EmailVerification;
    
    public function findLatestPendingForUser(User $user): ?EmailVerification;

    public function deletePendingForUser(User $user): int;

    public function save(EmailVerification $emailVerification, bool $flush = true): void;
}
