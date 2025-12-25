<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\EmailVerification;
use App\Modules\User\Domain\Entity\User;

interface EmailVerificationRepositoryInterface
{
    public function save(EmailVerification $emailVerification, bool $flush = true): void;
    public function findByTokenHash(string $tokenHash): ?EmailVerification;
    public function delete(EmailVerification $emailVerification, bool $flush = true): void;
    public function getEmailVerificationByEmail(string $email): ?EmailVerification;
    public function deletePendingForUser(User $user): int;
}
