<?php

namespace App\Modules\Media\Application\DTO;

final class MediaMutationResponse
{
    public function __construct(
        public readonly string $id,
    ) {}
}
