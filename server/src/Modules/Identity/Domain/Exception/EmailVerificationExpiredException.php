<?php

namespace App\Modules\Identity\Domain\Exception;

final class EmailVerificationExpiredException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('Email verification token is expired or already used.');
    }
}
