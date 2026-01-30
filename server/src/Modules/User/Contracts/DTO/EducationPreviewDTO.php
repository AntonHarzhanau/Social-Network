<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class EducationPreviewDTO
{
    public function __construct(
        public string $id,
        public string $institutionName,
        public ?string $programName,
        public ?string $degree,
        public string $startAt,
        public ?string $endAt,
    ) {}
}
