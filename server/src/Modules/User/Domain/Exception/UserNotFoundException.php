<?php

namespace App\Modules\User\Domain\Exception;

use App\Modules\Shared\Domain\Exception\DomainException;

final class UserNotFoundException extends \DomainException
{
    public function __construct()
    {
        parent::__construct("User not found.");
    }
}
