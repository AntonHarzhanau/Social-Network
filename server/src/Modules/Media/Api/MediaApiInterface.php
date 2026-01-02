<?php

namespace App\Modules\Media\Api;

interface MediaApiInterface
{
    /** @return array<string, MediaItemDTO> */
    public function getMediasByIds(array $ids): array;
}
