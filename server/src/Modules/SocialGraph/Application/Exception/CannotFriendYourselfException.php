<?php

namespace App\Modules\SocialGraph\Application\Exception;

final class CannotFriendYourselfException extends \DomainException
{
    public function __construct()
    {
        parent::__construct('You cannot send a friend request to yourself.');
    }
}
