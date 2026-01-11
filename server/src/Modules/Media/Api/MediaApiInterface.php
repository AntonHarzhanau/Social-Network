<?php

namespace App\Modules\Media\Api;

use Symfony\Component\Uid\Uuid;

interface MediaApiInterface
{
    /** @return array<string, MediaItemDTO> */
    public function getMediasByIds(?Uuid $currentUser, array $ids): array;
}
