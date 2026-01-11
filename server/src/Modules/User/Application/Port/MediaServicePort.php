<?php

namespace App\Modules\User\Application\Port;

use Symfony\Component\Uid\Uuid;

interface MediaServicePort
{
    public function getMediasByIds(?Uuid $currentUser, array $ids): array;
}
