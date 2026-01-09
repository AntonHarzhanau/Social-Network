<?php

namespace App\Modules\Media\Application\DTO;

final class MediaMetadata
{
    public function __construct(
        public readonly ?int $width = null,
        public readonly ?int $height = null,
        public readonly ?float $durationSeconds = null,
    ) {}
}
