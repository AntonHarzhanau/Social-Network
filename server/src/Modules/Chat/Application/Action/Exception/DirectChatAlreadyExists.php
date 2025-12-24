<?php

namespace App\Modules\Chat\Application\Action\Exception;

final class DirectChatAlreadyExists extends \DomainException
{
    public function __construct()
    {
        parent::__construct("A direct chat between users already exists.");
    }
}
