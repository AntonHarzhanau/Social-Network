<?php

namespace App\Modules\User\Application\Port;

interface MediaServicePort
{
    public function getMediasByIds(array $ids): array;
}
