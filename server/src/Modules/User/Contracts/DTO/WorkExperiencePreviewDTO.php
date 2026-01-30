<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class WorkExperiencePreviewDTO
{
    public function __construct(
        public string $id,
        public string $company,
        public ?string $positionTitle,
        public string $startAt,
        public ?string $endAt,
    ) {}
}
