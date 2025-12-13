<?php

namespace App\Modules\SocialGraph\Application\Exception;

use Throwable;

final class FriendshipAlreadyExistsException extends \DomainException
{
    public function __construct()
    {
        return parent::__construct('Friendship request already exists between these users.');
    }
}
