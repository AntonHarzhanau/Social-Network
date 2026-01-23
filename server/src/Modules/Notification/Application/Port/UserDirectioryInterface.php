<?php

namespace App\Modules\Notification\Application\Port;

interface UserDirectioryInterface
{
    public function getUser(string $userId);  
}
