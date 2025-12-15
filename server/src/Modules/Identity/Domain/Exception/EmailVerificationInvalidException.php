<?php

namespace App\Modules\Identity\Domain\Exception;

final class EmailVerificationInvalidException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('Email verification token is invalid.');
    }
}
