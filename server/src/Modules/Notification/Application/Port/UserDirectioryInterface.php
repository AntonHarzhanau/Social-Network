<?php

namespace App\Modules\Notification\Application\Port;

interface UserDirectioryInterface
{
    public function getUser(string $userId);
    public function getUserPreviews(array $userIds): array; 
}
