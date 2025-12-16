<?php

namespace App\Modules\User\Domain\Exception;

use App\Modules\Shared\Domain\Exception\DomainException;

final class EmailAlreadyInUseException extends \DomainException
{
    public function __construct(string $email)
    {
        parent::__construct("Email is already in use: {$email}");
    }
}
