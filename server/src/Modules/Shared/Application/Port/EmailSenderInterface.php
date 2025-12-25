<?php

namespace App\Modules\Shared\Application\Port;

use App\Modules\Shared\Application\Message\SendEmailMessage;

interface EmailSenderInterface 
{
    public function send(SendEmailMessage $email): void;
}
