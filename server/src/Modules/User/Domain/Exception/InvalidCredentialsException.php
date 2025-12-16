<?php

namespace App\Modules\User\Domain\Exception;

final class InvalidCredentialsException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('Invalid credentials.');
    }
}
