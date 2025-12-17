<?php

namespace App\Modules\User\Domain\Service;

final class EmailVerificationTokenGenerator
{
    /** @return array{raw: string, hash: string} */
    public function generateToken(): array
    {
        $raw = bin2hex(random_bytes(32));
        $hash = hash('sha256', $raw);
        return ['raw' => $raw, 'hash' => $hash];
    }
}
