<?php

namespace App\Modules\Identity\Domain\Exception;

final class InvalidCredentialsException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('Invalid credentials.');
    }
}
