<?php

namespace App\Modules\SocialGraph\Application\Exception;

final class PendingRequestNotFoundException extends \DomainException
{
    public function __construct()
    {
        parent::__construct('No pending friend request from this user.');
    }
}
